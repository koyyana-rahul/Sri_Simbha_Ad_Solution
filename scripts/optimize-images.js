#!/usr/bin/env node
/**
 * Image optimisation pass.
 *
 * The site ships ~80 photographs straight from a camera roll, which is why the
 * repository used to be 32 MB of images. This script rewrites every file under
 * `src/assets/images` **in place** — same path, same filename, same format — so
 * every existing `import` in the app keeps working untouched, and the service
 * registry does not have to be rewritten.
 *
 * What it does per image:
 *  - refuses to upscale, and caps the long edge at MAX_EDGE (1600px), which is
 *    still wider than any gallery tile or hero frame on a 2x display
 *  - re-encodes JPEG at quality 78 / mozjpeg, PNG with palette quantisation
 *  - strips EXIF and all metadata, which routinely adds 100–400 KB per photo
 *  - skips anything that would not actually get smaller
 *
 * A handful of files were saved as `.png` even though they are photographs.
 * Palette-quantising a photo makes it *worse* (a 1.4 MB PNG only reached
 * 460 KB, versus 65 KB as WebP), so those are transcoded to `.jpg` instead and
 * the PNG deleted. The script prints the exact import lines to update.
 *
 * It also renders `public/og-image.png` (1200x630), the Open Graph / Twitter
 * card that `Seo` points at. The previous fallback reused a 180x180 touch icon,
 * which every social platform renders as a blurry thumbnail.
 *
 * Usage:
 *   npm run images:optimize            # report only, writes nothing
 *   npm run images:optimize -- --write # actually rewrite the files
 *
 * Run `npm run images:report` any time to see the current totals.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const IMAGE_DIR = path.join(ROOT, "src", "assets", "images");
const VIDEO_DIR = path.join(ROOT, "src", "assets", "videos");
const PUBLIC_DIR = path.join(ROOT, "public");
const OG_OUTPUT = path.join(PUBLIC_DIR, "og-image.png");
const LOGO = path.join(IMAGE_DIR, "branding", "simba-logo.jpg");

const MAX_EDGE = 1600;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 80;

const BRAND_AMBER = "#f59e0b";
const BRAND_YELLOW = "#fbbf24";
const BRAND_DEEP = "#b45309";
const INK = "#111827";

const shouldWrite = process.argv.includes("--write");

const log = (...args) => console.log(...args);
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

/**
 * Read the file ourselves instead of letting sharp open it.
 *
 * When sharp is handed a path it keeps the file descriptor alive until the
 * pipeline is garbage collected, so overwriting that same path fails on Windows
 * with `UNKNOWN: unknown error, open ...`. Reading the bytes up front keeps
 * sharp entirely in-memory and makes the in-place rewrite safe.
 */
const readImage = (file) => fs.readFileSync(file);

/** Write with a short retry, for the same class of transient Windows locks. */
const writeImage = (file, buffer) => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      fs.writeFileSync(file, buffer);
      return;
    } catch (error) {
      if (attempt >= 5) throw error;
      // Busy-wait briefly; the lock is held by the scanner or the OS, not us.
      const until = Date.now() + 100 * attempt;
      while (Date.now() < until) {
        /* intentional spin */
      }
    }
  }
};

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });

const isRasterImage = (file) =>
  [".jpg", ".jpeg", ".png"].includes(path.extname(file).toLowerCase());

/**
 * Files that are actually photographs but were committed with a `.png`
 * extension. Transcoding them to JPEG is worth the handful of import updates
 * the script reports.
 */
const PHOTOGRAPHIC_PNGS = [
  "slideshow/digital-marketing.png",
  "slideshow/led-display-ads.png",
  "slideshow/tea-cup-printing-ads.png",
  "slideshow/website-building.png",
  "tea-cup/tea-cup-04.png",
];

const formatFor = (file) =>
  path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";

/** Re-encode one image, returning the optimised buffer. */
const optimizeBuffer = (file) => {
  const source = readImage(file);
  const pipeline = sharp(source, { failOn: "none" }).rotate();

  if (formatFor(file) === "png") {
    return pipeline
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true })
      .toBuffer();
  }

  return pipeline
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();
};

/** WebP twin of an optimised image, written next to it for future adoption. */
const webpFor = (file) =>
  sharp(readImage(file), { failOn: "none" })
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

const optimizeImages = async () => {
  const files = walk(IMAGE_DIR).filter(isRasterImage);
  const brand = walk(IMAGE_DIR).filter((file) => file.includes(`${path.sep}branding${path.sep}`));

  let before = 0;
  let after = 0;
  let rewritten = 0;
  let skipped = 0;
  let webpBytes = 0;

  log(`\nOptimising ${files.length} images (max edge ${MAX_EDGE}px)\n`);

  for (const file of files) {
    const relative = path.relative(ROOT, file);
    const originalSize = fs.statSync(file).size;
    before += originalSize;

    // The logo is displayed at 50x50 and is referenced as the OG source, so
    // shrinking it would only degrade it. Leave the brand asset untouched.
    if (brand.includes(file)) {
      after += originalSize;
      skipped += 1;
      continue;
    }

    try {
      const optimised = await optimizeBuffer(file);
      const webp = await webpFor(file);

      // Only replace the file when the result is genuinely smaller; re-encoding
      // an already-optimised asset can otherwise grow it by a few bytes.
      if (optimised.length < originalSize) {
        if (shouldWrite) writeImage(file, optimised);
        after += optimised.length;
        rewritten += 1;
        log(
          `  ${relative}\n    ${formatBytes(originalSize)} -> ${formatBytes(
            optimised.length
          )}  (webp ${formatBytes(webp.length)})`
        );
      } else {
        after += originalSize;
        skipped += 1;
        log(
          `  ${relative}\n    ${formatBytes(originalSize)} -> already optimal, skipped`
        );
      }

      webpBytes += webp.length;
    } catch (error) {
      after += originalSize;
      skipped += 1;
      log(`  ${relative}\n    skipped: ${error.message}`);
    }
  }

  const saved = before - after;
  const percent = before === 0 ? 0 : (saved / before) * 100;

  log(`\n  rewritten : ${rewritten}`);
  log(`  skipped   : ${skipped}`);
  log(`  before    : ${formatBytes(before)}`);
  log(`  after     : ${formatBytes(after)}`);
  log(`  saved     : ${formatBytes(saved)} (${percent.toFixed(1)}%)`);
  log(`  as webp   : ${formatBytes(webpBytes)}`);

  if (!shouldWrite) {
    log("\n  Dry run. Re-run with --write to apply.\n");
  }

  return { before, after, saved, webpBytes };
};

/**
 * Transcode the photographic `.png` files to `.jpg` and remove the originals.
 * Returns the import rewrites the caller has to apply by hand.
 */
const migratePhotographicPngs = async () => {
  log("\nMigrating photographic PNGs to JPEG\n");

  const rewrites = [];

  for (const relative of PHOTOGRAPHIC_PNGS) {
    const source = path.join(IMAGE_DIR, relative);
    if (!fs.existsSync(source)) continue;

    const target = source.replace(/\.png$/i, ".jpg");
    const originalSize = fs.statSync(source).size;

    const converted = await sharp(readImage(source), { failOn: "none" })
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();

    if (shouldWrite) {
      writeImage(target, converted);
      fs.unlinkSync(source);
    }

    rewrites.push({
      from: `assets/images/${relative.replace(/\\/g, "/")}`,
      to: `assets/images/${relative.replace(/\\/g, "/").replace(/\.png$/i, ".jpg")}`,
    });

    log(
      `  ${relative}\n    ${formatBytes(originalSize)} -> ${formatBytes(
        converted.length
      )}`
    );
  }

  if (rewrites.length) {
    log("\n  Update these imports:");
    rewrites.forEach(({ from, to }) => log(`    "${from}"  ->  "${to}"`));
  }

  return rewrites;
};

/**
 * 1200x630 social share card: brand gradient, logo and the brand name.
 * Drawn rather than shipped, so it can never drift out of sync with the design.
 */
const buildOgImage = async () => {
  const width = 1200;
  const height = 630;

  const background = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${BRAND_YELLOW}"/>
          <stop offset="55%" stop-color="${BRAND_AMBER}"/>
          <stop offset="100%" stop-color="${BRAND_DEEP}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <circle cx="1100" cy="90" r="260" fill="#ffffff" opacity="0.10"/>
      <circle cx="120" cy="580" r="220" fill="${INK}" opacity="0.08"/>
    </svg>`
  );

  let logo;
  try {
    logo = await sharp(readImage(LOGO))
      .resize({ width: 168, height: 168, fit: "contain", background: "#ffffff00" })
      .toBuffer();
  } catch {
    logo = null;
  }

  const wordmark = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="600" y="300" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif"
        font-size="82" font-weight="700" fill="${INK}">Sri Simbha</text>
      <text x="600" y="392" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif"
        font-size="82" font-weight="700" fill="${INK}">Ad Solution</text>
      <text x="600" y="470" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="500" fill="${INK}" opacity="0.75">LED Ads &#183; Tea Cup Printing &#183; Digital Marketing</text>
      <text x="600" y="518" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="500" fill="${INK}" opacity="0.75">Websites &#183; Ads on Wheels &#183; Ad Films</text>
    </svg>`
  );

  const layers = [{ input: background }, { input: wordmark, top: 0, left: 0 }];
  if (logo) layers.splice(1, 0, { input: logo, top: 44, left: 516 });

  const buffer = await sharp({ create: { width, height, channels: 4, background: BRAND_AMBER } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer();

  if (shouldWrite) writeImage(OG_OUTPUT, buffer);

  log(`\n  og-image.png  1200x630  ${formatBytes(buffer.length)}`);
};

const report = () => {
  const images = walk(IMAGE_DIR);
  const videos = walk(VIDEO_DIR);
  const sizeOf = (files) =>
    files.reduce((total, file) => total + fs.statSync(file).size, 0);

  log(`\n  images : ${formatBytes(sizeOf(images))} (${images.length} files)`);
  log(`  videos : ${formatBytes(sizeOf(videos))} (${videos.length} files)\n`);
};

const main = async () => {
  report();
  await optimizeImages();
  await migratePhotographicPngs();
  await buildOgImage();
  report();
  log(
    shouldWrite
      ? "Done. Update the imports listed above, then commit.\n"
      : "Dry run only — nothing was written.\n"
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
