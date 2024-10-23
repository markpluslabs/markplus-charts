import { FlowchartLexer } from './lexer';
import { parserInstance } from './parser';
import { toAstVisitorInstance } from './toAst';

// Example input
const input = `
  A --> B
  B --> C
  A --> C
`;

// Lexing
const lexResult = FlowchartLexer.tokenize(input);
if (lexResult.errors.length > 0) {
  throw new Error('Lexing errors detected');
}

// Parsing
parserInstance.input = lexResult.tokens;
const cst = parserInstance.flowchart();
if (parserInstance.errors.length > 0) {
  throw new Error('Parsing errors detected');
}

// CST to AST
const ast = toAstVisitorInstance.visit(cst);

console.log(ast);
