import { createToken, Lexer } from 'chevrotain';
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
});

const PropValue = createToken({
  name: 'PropValue',
  pattern: /(?:[^};\\]|\\.)+/,
  pop_mode: true,
});

const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
});

const RCurly = createToken({
  name: 'RCurly',
  pattern: /\}/,
  pop_mode: true,
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

describe('poc lexer', () => {
  test('simple', () => {
    const r = lexer.tokenize('A{prop3: c; prop4: d} -->{prop1: 4} B{prop2: 5}');
    if (r.errors.length > 0) {
      console.log(r.errors);
    }
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      'Node: A',
      'LCurly: {',
      'PropKey: prop3',
      'Colon: :',
      'PropValue: c',
      'Semicolon: ;',
      'PropKey: prop4',
      'Colon: :',
      'PropValue: d',
      'RCurly: }',
      'Link: -->',
      'LCurly: {',
      'PropKey: prop1',
      'Colon: :',
      'PropValue: 4',
      'RCurly: }',
      'Node: B',
      'LCurly: {',
      'PropKey: prop2',
      'Colon: :',
      'PropValue: 5',
      'RCurly: }',
    ]);
  });
});
