import { describe, expect, test } from "vitest";

import { generate } from "../../src";

describe("shapes", () => {
  test("rect", async () => {
    const svgStr = await generate("A");
    expect(svgStr).toContain("<rect");
  });

  test("rect 2", async () => {
    const svgStr = await generate("A{shape:rect}");
    expect(svgStr).toContain("<rect");
  });

  test("circle", async () => {
    const svgStr = await generate("A{shape:circle}");
    expect(svgStr).toContain("<circle");
  });

  test("circle", async () => {
    const svgStr = await generate("A{shape:circle}");
    expect(svgStr).toContain("<circle");
  });

  test("ellipse", async () => {
    const svgStr = await generate("A{shape:ellipse}");
    expect(svgStr).toContain("<ellipse");
  });

  test("diamond", async () => {
    const svgStr = await generate("A{shape:diamond}");
    expect(svgStr).toContain("<polygon");
  });
});
