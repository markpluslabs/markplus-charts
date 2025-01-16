import { describe, expect, test } from "vitest";

import lexer from "../../src/chevrotain/lexer";

describe("lexer", () => {
  test("default", () => {
    const input = "A{prop3: c; prop4: d} ->{prop1: 4} B{prop2: 5}";
    const r = lexer.tokenize(input);
    if (r.errors.length > 0) {
      console.log(r.errors);
    }
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      "Node0: A",
      "PropKey: prop3:",
      "PropValue: c",
      "PropKey: prop4:",
      "PropValue: d",
      "Link: ->",
      "PropKey: prop1:",
      "PropValue: 4",
      "Node: B",
      "PropKey: prop2:",
      "PropValue: 5",
    ]);
  });

  test("singler node", () => {
    const r = lexer.tokenize("A");
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual(["Node0: A"]);
  });

  test("no props", () => {
    const r = lexer.tokenize("A -> B");
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual(["Node0: A", "Link: ->", "Node: B"]);
  });

  test("global props", () => {
    const r = lexer.tokenize("direction: down\nA -> B");
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      "PropKey: direction:",
      "PropValue: down",
      "Node0: A",
      "Link: ->",
      "Node: B",
    ]);
  });

  test("special characters", () => {
    const r = lexer.tokenize("你->好");
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      "Node0: 你",
      "Link: ->",
      "Node: 好",
    ]);
  });

  test("special characters 2", () => {
    const r = lexer.tokenize("你-->好");
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      "Node0: 你-",
      "Link: ->",
      "Node: 好",
    ]);
  });

  test("special characters 3", () => {
    const r = lexer.tokenize("Monkey.D.Luffy -> Monkey.D.Garp");
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      "Node0: Monkey.D.Luffy",
      "Link: ->",
      "Node: Monkey.D.Garp",
    ]);
  });
});
