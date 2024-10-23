import { createToken, Lexer } from 'chevrotain';

// Tokens
export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z_]\w*/,
});
export const Arrow = createToken({ name: 'Arrow', pattern: /-->/ });
const Newline = createToken({
  name: 'Newline',
  pattern: /\n/,
  group: Lexer.SKIPPED,
});
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// All tokens
export const allTokens = [WhiteSpace, Newline, Arrow, Identifier];

// Create the lexer instance
const lexer = new Lexer(allTokens);

export default lexer;
