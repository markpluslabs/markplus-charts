import { describe, expect, test } from "vitest";

import { generate } from "../../src";

describe("errors", () => {
  test("lexing error", async () => {
    let error = false;
    try {
      await generate("A -> ❌");
    } catch (e) {
      error = true;
      expect(e.message).toMatch("Lexing error at ");
    }
    expect(error).toBe(true);
  });

  test("parsing error", async () => {
    let error = false;
    try {
      await generate("A ->");
    } catch (e) {
      error = true;
      expect(e.message).toMatch("Parsing error at ");
    }
    expect(error).toBe(true);
  });

  test("parsing empty", async () => {
    let error = false;
    try {
      const r = await generate("");
      expect(r.includes("false")).toBeFalsy();
      expect(r).toBe(
        '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 0 0"></svg>',
      );
    } catch (e) {
      error = true;
    }
    expect(error).toBe(false);
  });
});
