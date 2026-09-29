import { useEffect } from "react";

/**
 * Emits JSON-LD structured data into `<head>`.
 *
 * Usage:
 *   <StructuredData data={buildLocalBusinessSchema()} />
 *   <StructuredData data={[website, localBusiness]} />
 *
 * A single `<script type="application/ld+json">` is used, holding a `@graph`
 * array, which is the form Google recommends for more than one entity. The tag
 * is marked `data-managed-by-structured-data` and removed on unmount, so schema
 * from one route cannot leak into the next during client-side navigation.
 *
 * The payload is serialised on every render and the effect depends on the
 * resulting *string*, never on the object. The builders return a fresh object
 * each call, so depending on object identity would tear down and re-insert the
 * tag on every render; depending on the string means the DOM is only touched
 * when the markup actually changes.
 *
 * `<` is escaped to `<` so a stray `</script>` inside any content
 * string cannot break out of the tag.
 */
const serialise = (data) => {
  if (!data) return "";

  const payload = Array.isArray(data) ? data : [data];
  if (payload.length === 0) return "";

  const graph = payload.length === 1 ? payload[0] : { "@graph": payload };

  return JSON.stringify(graph).replace(/</g, "\\u003c");
};

const StructuredData = ({ data }) => {
  const serialised = serialise(data);

  useEffect(() => {
    if (!serialised) return undefined;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-managed-by-structured-data", "true");
    script.textContent = serialised;

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [serialised]);

  return null;
};

export default StructuredData;
