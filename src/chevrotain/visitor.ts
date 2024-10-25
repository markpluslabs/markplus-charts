import { CstNode, IToken } from 'chevrotain';

import Ast from './ast';
import parser from './parser';

const BaseVisitor = parser.getBaseCstVisitorConstructor<void, Ast>();

let id = 0;
class Visitor extends BaseVisitor {
  ast = new Ast();
  constructor() {
    super();
    this.validateVisitor();
  }

  // statements is the LABEL in ./parser.ts
  parse({ statements }: { statements: CstNode[] }) {
    statements.forEach((c: CstNode) => this.visit(c));
    return this.ast;
  }

  // from, link and to are the LABELs in ./parser.ts
  statement({
    from,
    link,
    to,
    label,
  }: {
    from: IToken[];
    link: IToken[];
    to: IToken[];
    label: IToken[];
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
    let labelStr: string | undefined = undefined;
    if (label) {
      labelStr = label[0].image;
      labelStr = labelStr.slice(1, labelStr.length - 1);
    }
    this.ast.edges.push({
      id: `e_${id++}`,
      from: fromId,
      to: toId,
      directional,
      label: labelStr,
    });
  }
}

const visitor = new Visitor();
export default visitor;
