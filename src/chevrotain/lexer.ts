import { createToken, Lexer } from 'chevrotain';

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});
const NewLine = createToken({
  name: 'NewLine',
  pattern: /\n/,
  group: Lexer.SKIPPED,
});

export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z0-9_]+/,
});

export const Link = createToken({
  name: 'Link',
  pattern: /-->/,
});

export const LeftCurly = createToken({
  name: 'LeftCurly',
  pattern: /\{/,
  push_mode: 'props_mode',
});

export const PropKey = createToken({
  name: 'PropKey',
  pattern: /[a-zA-Z][a-zA-Z0-9_-]*\s*:/,
});

export const PropValue = createToken({
  name: 'PropValue',
  pattern: /(?:[^;}\\]|\\.)+/,
});

export const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
});

export const RightCurly = createToken({
  name: 'RightCurly',
  pattern: /\}/,
  pop_mode: true,
});

export const multiModeLexerDefinition = {
  modes: {
    statement_mode: [WhiteSpace, NewLine, Identifier, Link, LeftCurly],
    props_mode: [
      WhiteSpace,
      NewLine,
      PropKey,
      PropValue,
      Semicolon,
      RightCurly,
    ],
  },
  defaultMode: 'statement_mode',
};

const lexer = new Lexer(multiModeLexerDefinition);
export default lexer;
