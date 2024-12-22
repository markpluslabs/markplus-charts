import Ast from "./ast.js";
import lexer from "./lexer.js";
import { normalize } from "./normalizer.js";
import parser from "./parser.js";
import visitor from "./visitor.js";

export const generateAst = (input: string): Ast => {
  // lexing
  const lexingResult = lexer.tokenize(input);
  if (lexingResult.errors.length > 0) {
    throw new Error(
      "Lexing errors: " + JSON.stringify(lexingResult.errors, null, 2),
    );
  }

  // parsing
  parser.input = lexingResult.tokens;
  const cst = parser.parse();
  if (parser.errors.length > 0) {
    throw new Error(
      "Parsing errors: " + JSON.stringify(parser.errors, null, 2),
    );
  }

  // CST to AST
  const ast: Ast = visitor.visit(cst);
  return ast;
};

export const normalizeAst = (ast: Ast): Ast => {
  const newAst = normalize(ast);
  newAst.createIndex();
  return newAst;
};
