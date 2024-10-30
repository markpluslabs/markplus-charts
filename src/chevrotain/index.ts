import Ast from './ast';
import lexer from './lexer';
import parser from './parser';
import visitor from './visitor';

export const generateAst = (input: string): Ast => {
  // lexing
  const lexingResult = lexer.tokenize(input);
  if (lexingResult.errors.length > 0) {
    throw new Error(
      'Lexing errors: ' + JSON.stringify(lexingResult.errors, null, 2),
    );
  }

  // parsing
  parser.input = lexingResult.tokens;
  const cst = parser.parse();
  if (parser.errors.length > 0) {
    throw new Error(
      'Parsing errors: ' + JSON.stringify(parser.errors, null, 2),
    );
  }

  // CST to AST
  const ast = visitor.visit(cst);
  ast.createIndex();
  return ast;
};
