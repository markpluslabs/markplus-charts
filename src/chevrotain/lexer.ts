import { createToken, Lexer } from 'chevrotain';

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const Comment = createToken({
  name: 'Comment',
  pattern: /\/\/[^\n]*/,
  group: Lexer.SKIPPED,
});

export const Node = createToken({
  name: 'Node',
  pattern: /[a-zA-Z0-9_]+/,
});

const LCurly = createToken({
  name: 'LCurly',
  pattern: /\{/,
  push_mode: 'props_mode',
  group: Lexer.SKIPPED,
});

export const Link = createToken({
  name: 'Link',
  pattern: /-->/,
});

export const PropKey = createToken({
  name: 'PropKey',
  pattern: /[a-zA-Z][a-zA-Z0-9-]*/,
});

const Colon = createToken({
  name: 'Colon',
  pattern: /:/,
  push_mode: 'value_mode',
  group: Lexer.SKIPPED,
});

const matchPropValue = (text: string, startOffset: number): [string] | null => {
  if (text.length === startOffset) {
    return null;
  }
  const indexes = [
    text.indexOf(';', startOffset),
    text.indexOf('}', startOffset),
    text.indexOf('//', startOffset),
  ].filter((i) => i !== -1);
  const specialIndex = indexes.length > 0 ? Math.min(...indexes) : -1;
  if (specialIndex === -1) {
    return [text.substring(startOffset)];
  }
  if (specialIndex === startOffset) {
    return null;
  }
  if (text[specialIndex - 1] === '\\') {
    const r1 = text.substring(startOffset, specialIndex + 1);
    const r2 = matchPropValue(text, specialIndex + 1);
    return r2 === null ? [r1] : [r1 + r2[0]];
  }
  return [text.substring(startOffset, specialIndex)];
};
export const PropValue = createToken({
  name: 'PropValue',
  pattern: matchPropValue,
  pop_mode: true,
  line_breaks: true,
});

const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
  group: Lexer.SKIPPED,
});

const RCurly = createToken({
  name: 'RCurly',
  pattern: /\}/,
  pop_mode: true,
  group: Lexer.SKIPPED,
});

export const multiModeLexerDefinition = {
  modes: {
    statement_mode: [WhiteSpace, Comment, Node, LCurly, Link],
    props_mode: [WhiteSpace, Comment, PropKey, Colon, Semicolon, RCurly],
    value_mode: [WhiteSpace, Comment, PropValue],
  },
  defaultMode: 'statement_mode',
};

const lexer = new Lexer(multiModeLexerDefinition);
export default lexer;
