import {
  getCircularWindow,
  splitTitleDetail,
  wrapIndex,
  cx,
  scrollToTop,
} from "./helpers";

describe("splitTitleDetail", () => {
  it("splits a 'Title: detail' benefit string", () => {
    expect(
      splitTitleDetail("Increased Reach: Target thousands of viewers daily.")
    ).toEqual({
      title: "Increased Reach",
      detail: "Target thousands of viewers daily.",
    });
  });

  it("keeps additional colons inside the detail", () => {
    expect(splitTitleDetail("Note: a: b: c")).toEqual({
      title: "Note",
      detail: "a: b: c",
    });
  });

  it("returns an empty detail when there is no separator", () => {
    expect(splitTitleDetail("Just a title")).toEqual({
      title: "Just a title",
      detail: "",
    });
  });

  it("tolerates an undefined value", () => {
    expect(splitTitleDetail()).toEqual({ title: "", detail: "" });
  });
});

describe("wrapIndex", () => {
  it("wraps forwards past the end", () => {
    expect(wrapIndex(6, 6)).toBe(0);
  });

  it("wraps backwards past the start", () => {
    expect(wrapIndex(-1, 6)).toBe(5);
  });

  it("returns 0 for an empty collection", () => {
    expect(wrapIndex(3, 0)).toBe(0);
  });
});

describe("getCircularWindow", () => {
  const items = ["a", "b", "c", "d"];

  it("returns consecutive items", () => {
    expect(getCircularWindow(items, 0, 2)).toEqual(["a", "b"]);
  });

  it("wraps around the end of the collection", () => {
    expect(getCircularWindow(items, 3, 2)).toEqual(["d", "a"]);
  });

  it("returns an empty array for an empty collection", () => {
    expect(getCircularWindow([], 0, 2)).toEqual([]);
  });
});

describe("cx", () => {
  it("joins truthy class names and drops falsy values", () => {
    expect(cx("a", false, undefined, "b")).toBe("a b");
  });
});

describe("scrollToTop", () => {
  it("asks the window to scroll to the top", () => {
    const scrollTo = jest.fn();
    window.scrollTo = scrollTo;

    scrollToTop("smooth");

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
});
