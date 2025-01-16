import { createToken, Lexer } from "chevrotain";

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const Comment = createToken({
  name: "Comment",
  pattern: /\/\/[^\n]*/,
  group: Lexer.SKIPPED,
});

// very first node
export const Node0 = createToken({
  name: "Node0",
  pattern: /(?:[^\s{}:/;>-]|-(?!>))+/,
  push_mode: "statements_mode",
});
export const Node = createToken({
  name: "Node",
  pattern: /(?:[^\s{}:/;>-]|-(?!>))+/,
});

const LCurly = createToken({
  name: "LCurly",
  pattern: /\{/,
  push_mode: "props_mode",
  group: Lexer.SKIPPED,
});

export const Link = createToken({
  name: "Link",
  pattern: /->/,
});

export const PropKey = createToken({
  name: "PropKey",
  pattern: /[a-zA-Z][a-zA-Z0-9-]*\s*:/,
  push_mode: "value_mode",
});

const indexOfSpecial = (
  text: string,
  startIndex: number,
): number | undefined => {
  for (let i = startIndex; i < text.length; i++) {
    if (
      text[i] === ";" ||
      text[i] === "\n" ||
      text[i] === "}" ||
      (text[i] === "/" && text[i + 1] === "/")
    ) {
      return i;
    }
  }
  return undefined;
};
const matchPropValue = (text: string, startOffset: number): [string] | null => {
  let specialIndex = indexOfSpecial(text, startOffset);
  while (specialIndex && text[specialIndex - 1] === "\\") {
    specialIndex = indexOfSpecial(text, specialIndex + 1);
  }
  const r = text.substring(startOffset, specialIndex); // specialIndex could be undefined
  return r.length > 0 ? [r] : null;
};
export const PropValue = createToken({
  name: "PropValue",
  pattern: matchPropValue,
  pop_mode: true,
  line_breaks: true,
});

const Semicolon = createToken({
  name: "Semicolon",
  pattern: /;/,
  group: Lexer.SKIPPED,
});

const RCurly = createToken({
  name: "RCurly",
  pattern: /\}/,
  pop_mode: true,
  group: Lexer.SKIPPED,
});

export const multiModeLexerDefinition = {
  modes: {
    global_mode: [WhiteSpace, Comment, PropKey, Semicolon, Node0],
    statements_mode: [WhiteSpace, Comment, Node, LCurly, Link],
    props_mode: [WhiteSpace, Comment, PropKey, Semicolon, RCurly],
    value_mode: [WhiteSpace, Comment, PropValue],
  },
  defaultMode: "global_mode",
};

const lexer = new Lexer(multiModeLexerDefinition);
export default lexer;
