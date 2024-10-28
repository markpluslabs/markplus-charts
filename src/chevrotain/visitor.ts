import { CstNode } from 'chevrotain';

import Ast, { AstLink, AstNode, AstProps } from './ast';
import parser from './parser';

const BaseVisitor = parser.getBaseCstVisitorConstructor();
class Visitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  parse(ctx) {
    const ast = new Ast();
    ctx.statements.forEach((c: CstNode) => {
      const { nodes, link } = this.visit(c);
      nodes.forEach((n) => {
        const existingNode = ast.nodes.find((m) => m.id === n.id);
        if (existingNode) {
          Object.assign(existingNode.props, n.props);
        } else {
          ast.nodes.push(n);
        }
      });
      if (link) {
        while (ast.links.find((l) => l.id === link.id)) {
          link.id += '-';
        }
        ast.links.push(link);
      }
    });
    return ast;
  }

  statement(ctx) {
    const nodes: AstNode[] = [];
    const fromNodeId = ctx.fromNode[0].image;
    let fromNodeProps = {};
    if (ctx.fromNodeProps) {
      fromNodeProps = this.visit(ctx.fromNodeProps[0]);
    }
    nodes.push({ id: fromNodeId, props: fromNodeProps });

    let link: AstLink | undefined = undefined;
    if (ctx.link) {
      const toNodeId = ctx.toNode[0].image;
      let toNodeProps = {};
      if (ctx.toNodeProps) {
        toNodeProps = this.visit(ctx.toNodeProps[0]);
      }
      nodes.push({ id: toNodeId, props: toNodeProps });

      let linkProps = {};
      if (ctx.linkProps) {
        linkProps = this.visit(ctx.linkProps[0]);
      }
      link = {
        id: `${fromNodeId}-${toNodeId}`,
        props: linkProps,
        from: fromNodeId,
        to: toNodeId,
      };
    }
    return { nodes, link };
  }

  properties(ctx) {
    const props: AstProps = {};
    ctx.properties?.forEach((c: CstNode) => {
      Object.assign(props, this.visit(c));
    });
    return props;
  }

  property(ctx) {
    const propKey = ctx.propKey[0].image;
    const propValue = ctx.propValue[0].image
      .trim()
      .replace(/\\;/g, ';')
      .replace(/\\}/g, '}');
    return { [propKey]: propValue };
  }
}

const visitor = new Visitor();
export default visitor;
