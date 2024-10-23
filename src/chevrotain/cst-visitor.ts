import { CstNode, IToken } from 'chevrotain';

import parser from './parser';

interface Node {
  id: string;
  label: string;
}

interface Edge {
  from: string;
  to: string;
}

interface AST {
  nodes: Node[];
  edges: Edge[];
}

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

class CstVisitor extends BaseCstVisitor {
  ast: AST = { nodes: [], edges: [] };
  constructor() {
    super();
    this.validateVisitor();
  }

  flowchart({ statement }: { statement: CstNode[] }) {
    statement.forEach((statement: CstNode) => {
      this.visit(statement);
    });
    return this.ast;
  }

  statement({ connection }: { connection: CstNode }) {
    this.visit(connection);
  }

  connection({ from, to }: { from: IToken[]; to: IToken[] }) {
    const fromToken = from[0];
    const toToken = to[0];

    const fromId = fromToken.image;
    const toId = toToken.image;

    // Add nodes if they don't exist
    if (!this.ast.nodes.find((n) => n.id === fromId)) {
      this.ast.nodes.push({ id: fromId, label: fromId });
    }
    if (!this.ast.nodes.find((n) => n.id === toId)) {
      this.ast.nodes.push({ id: toId, label: toId });
    }

    // Add edge
    this.ast.edges.push({ from: fromId, to: toId });
  }
}

const cstVisitor = new CstVisitor();

export default cstVisitor;
