import { CstNode, IToken } from 'chevrotain';

import parser from './parser';

interface AST {
  nodes: Node[];
  edges: Edge[];
}
interface Node {
  id: string;
  label: string;
}
interface Edge {
  from: string;
  to: string;
  directional: boolean;
}

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

class CstVisitor extends BaseCstVisitor {
  ast: AST = { nodes: [], edges: [] };
  constructor() {
    super();
    this.validateVisitor();
  }

  // statements is the LABEL in ./parser.ts
  parse({ statements }: { statements: CstNode[] }) {
    statements.forEach((c: CstNode) => this.visit(c));
    return this.ast;
  }

  // from and to are the LABELs in ./parser.ts
  statement({
    from,
    link,
    to,
  }: {
    from: IToken[];
    link: IToken[];
    to: IToken[];
  }) {
    const fromId = from[0].image;
    const directional = link[0].image.endsWith('>');
    const toId = to[0].image;

    // Add nodes if they don't exist
    [fromId, toId].forEach((id) => {
      if (!this.ast.nodes.find((n) => n.id === id)) {
        this.ast.nodes.push({ id, label: id });
      }
    });

    // Add edge
    this.ast.edges.push({ from: fromId, to: toId, directional });
  }
}

const cstVisitor = new CstVisitor();

export default cstVisitor;
