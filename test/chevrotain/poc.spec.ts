import { createToken, CstNode, CstParser, Lexer } from 'chevrotain';
import { describe, expect, test } from 'vitest';

//
// start of lexer
//

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const Node = createToken({
  name: 'Node',
  pattern: /[a-zA-Z0-9_]+/,
});

const LCurly = createToken({
  name: 'LCurly',
  pattern: /\{/,
  push_mode: 'props_mode',
  group: Lexer.SKIPPED,
});

export const Link = createToken({
  name: 'Link',
  pattern: /-->/,
});

export const PropKey = createToken({
  name: 'PropKey',
  pattern: /[a-zA-Z][a-zA-Z0-9-]*/,
});

const Colon = createToken({
  name: 'Colon',
  pattern: /:/,
  push_mode: 'value_mode',
  group: Lexer.SKIPPED,
});

const PropValue = createToken({
  name: 'PropValue',
  pattern: /(?:[^};\\]|\\.)+/,
  pop_mode: true,
});

const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
  group: Lexer.SKIPPED,
});

const RCurly = createToken({
  name: 'RCurly',
  pattern: /\}/,
  pop_mode: true,
  group: Lexer.SKIPPED,
});

export const multiModeLexerDefinition = {
  modes: {
    statement_mode: [WhiteSpace, Node, LCurly, Link],
    props_mode: [WhiteSpace, PropKey, Colon, Semicolon, RCurly],
    value_mode: [WhiteSpace, PropValue],
  },
  defaultMode: 'statement_mode',
};

const lexer = new Lexer(multiModeLexerDefinition);

//
// start of parser
//

class Parser extends CstParser {
  constructor() {
    super(multiModeLexerDefinition);
    this.performSelfAnalysis();
  }

  parse = this.RULE('parse', () => {
    this.MANY(() => {
      this.SUBRULE(this.statement, { LABEL: 'statements' });
    });
  });

  statement = this.RULE('statement', () => {
    this.CONSUME(Node, { LABEL: 'fromNode' });
    this.OPTION(() => {
      this.SUBRULE(this.properties, { LABEL: 'fromNodeProps' });
    });
    this.OPTION1(() => {
      this.CONSUME(Link, { LABEL: 'link' });
      this.OPTION2(() => {
        this.SUBRULE1(this.properties, { LABEL: 'linkProps' });
      });
      this.CONSUME1(Node, { LABEL: 'toNode' });
      this.OPTION3(() => {
        this.SUBRULE2(this.properties, { LABEL: 'toNodeProps' });
      });
    });
  });

  properties = this.RULE('properties', () => {
    this.MANY(() => {
      this.SUBRULE(this.property, { LABEL: 'properties' });
    });
  });

  property = this.RULE('property', () => {
    this.CONSUME(PropKey, { LABEL: 'propKey' });
    this.CONSUME1(PropValue, { LABEL: 'propValue' });
  });
}
const parser = new Parser();

//
// start of visitor
//

type AstProps = { [key: string]: string };
class Ast {
  nodes: AstNode[] = [];
  links: AstLink[] = [];
}
interface AstNode {
  id: string;
  props: AstProps;
}
interface AstLink {
  id: string;
  from: string;
  to: string;
  props: AstProps;
}

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

  properties({ properties }: { properties: CstNode[] }) {
    const props: AstProps = {};
    properties.forEach((c: CstNode) => {
      Object.assign(props, this.visit(c));
    });
    return props;
  }

  property(ctx) {
    const propKey = ctx.propKey[0].image;
    const propValue = ctx.propValue[0].image;
    return { [propKey]: propValue };
  }
}

const visitor = new Visitor();

//
// start of tests
//

describe('poc', () => {
  const input = 'A{prop3: c; prop4: d} -->{prop1: 4} B{prop2: 5}';
  test('lexer', () => {
    const r = lexer.tokenize(input);
    if (r.errors.length > 0) {
      console.log(r.errors);
    }
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      'Node: A',
      'PropKey: prop3',
      'PropValue: c',
      'PropKey: prop4',
      'PropValue: d',
      'Link: -->',
      'PropKey: prop1',
      'PropValue: 4',
      'Node: B',
      'PropKey: prop2',
      'PropValue: 5',
    ]);
  });
  test('parser', () => {
    const r = lexer.tokenize(input);
    parser.input = r.tokens;
    const cst = parser.parse();
    if (parser.errors.length > 0) {
      console.log(parser.errors);
    }
    expect(parser.errors.length).toBe(0);
    expect(cst.children.statements.length).toBe(1); // 1 statement
  });
  test('visitor', () => {
    const r = lexer.tokenize(input);
    parser.input = r.tokens;
    const cst = parser.parse();
    const ast = visitor.visit(cst);
    expect(ast).toEqual({
      nodes: [
        { id: 'A', props: { prop3: 'c', prop4: 'd' } },
        { id: 'B', props: { prop2: '5' } },
      ],
      links: [{ id: 'A-B', from: 'A', to: 'B', props: { prop1: '4' } }],
    });
  });
});
