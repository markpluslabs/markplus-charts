import { createToken, CstParser, Lexer } from 'chevrotain';
import { describe, expect, test } from 'vitest';

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
      this.SUBRULE(this.property);
    });
  });

  property = this.RULE('property', () => {
    this.CONSUME(PropKey);
    this.CONSUME1(PropValue);
  });
}
const parser = new Parser();

describe('poc', () => {
  test('lexer', () => {
    const r = lexer.tokenize('A{prop3: c; prop4: d} -->{prop1: 4} B{prop2: 5}');
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
    const r = lexer.tokenize('A{prop3: c; prop4: d} -->{prop1: 4} B{prop2: 5}');
    parser.input = r.tokens;
    const cst = parser.parse();
    if (parser.errors.length > 0) {
      console.log(parser.errors);
    }
    expect(parser.errors.length).toBe(0);
    console.log(JSON.stringify(cst, null, 2));
    expect(cst.children.statements.length).toBe(1); // 1 statement
  });
});
