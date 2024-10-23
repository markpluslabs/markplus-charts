import { createToken, Lexer } from 'chevrotain';

const WhiteSpace = createToken({
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
  pattern: /[a-zA-Z_]\w*/,
});

export const Arrow = createToken({ name: 'Arrow', pattern: /-->/ });

export const allTokens = [WhiteSpace, NewLine, Identifier, Arrow];

const lexer = new Lexer(allTokens);

export default lexer;
