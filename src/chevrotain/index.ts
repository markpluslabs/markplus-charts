import cstVisitor from './cst-visitor';
import lexer from './lexer';
import parser from './parser';

export const toAst = (input: string) => {
  // Lexing
  const lexingResult = lexer.tokenize(input);
  if (lexingResult.errors.length > 0) {
    throw new Error('Lexing errors detected');
  }

  // Parsing
  parser.input = lexingResult.tokens;
  const cst = parser.elkchart();
  if (parser.errors.length > 0) {
    throw new Error('Parsing errors detected');
  }

  // CST to AST
  const ast = cstVisitor.visit(cst);
  return ast;
};
