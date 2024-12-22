import Ast from "./ast.js";
import lexer from "./lexer.js";
import { normalize } from "./normalizer.js";
import parser from "./parser.js";
import visitor from "./visitor.js";
import { formatLexingErrors, formatParsingErrors } from "./errors.js";

export const generateAst = (input: string): Ast => {
  // lexing
  const lexingResult = lexer.tokenize(input);
  if (lexingResult.errors.length > 0) {
    throw new Error(
      formatLexingErrors(lexingResult.errors, input),
    );
  }

  // parsing
  parser.input = lexingResult.tokens;
  const cst = parser.parse();
  if (parser.errors.length > 0) {
    throw new Error(
      formatParsingErrors(parser.errors, input),
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
