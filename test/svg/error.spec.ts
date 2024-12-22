import { describe, expect, test } from "vitest";

import { generate } from "../../src";

describe("errors", () => {
  test("lexing error", async () => {
    let error = false;
    try {
      await generate("A -> ❌");
    } catch (e) {
      error = true;
      console.log(e.message);
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
      console.log(e.message);
      expect(e.message).toMatch("Parsing error at ");
    }
    expect(error).toBe(true);
  });
});
