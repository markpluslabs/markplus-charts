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
const allTokens = [WhiteSpace, Newline, Arrow, Identifier];

// Create the lexer instance
const FlowchartLexer = new Lexer(allTokens);

export { allTokens, FlowchartLexer };
