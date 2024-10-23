import cstVisitor from './cst-visitor';
import lexer from './lexer';
import parser from './parser';

// Example input
const input = `
  A --> B
  B --> C
  A --> C
`;

// Lexing
const lexResult = lexer.tokenize(input);
if (lexResult.errors.length > 0) {
  throw new Error('Lexing errors detected');
}

// Parsing
parser.input = lexResult.tokens;
const cst = parser.flowchart();
if (parser.errors.length > 0) {
  throw new Error('Parsing errors detected');
}

// CST to AST
const ast = cstVisitor.visit(cst);

console.log(ast);
