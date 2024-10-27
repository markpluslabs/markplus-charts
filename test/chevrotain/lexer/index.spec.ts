import { describe, expect, test } from 'vitest';

import lexer from '../../../src/chevrotain/lexer';

describe('lexer', () => {
  test('simple', () => {
    const r = lexer.tokenize('A --> B');
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual(['Identifier: A', 'Link: -->', 'Identifier: B']);
  });

  test('complex', () => {
    const r = lexer.tokenize('A{prop1:a} -->{prop2: b} B{prop3: c; prop4: d}');
    console.log(r.errors);
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual([
      'Identifier: A',
      'LeftCurly: {',
      'PropKey: prop1:',
      'PropValue: a',
      'RightCurly: }',
      'Link: -->',
      'LeftCurly: {',
      'PropKey: prop2:',
      'PropValue: b',
      'RightCurly: }',
      'Identifier: B',
      'LeftCurly: {',
      'PropKey: prop3:',
      'PropValue: c;',
      'PropKey: prop4:',
      'PropValue: d',
      'RightCurly: }',
    ]);
  });

  test('node only', () => {
    const r = lexer.tokenize('A');
    expect(r.errors.length).toBe(0);
    const tokens = r.tokens.map((t) => `${t.tokenType.name}: ${t.image}`);
    expect(tokens).toEqual(['Identifier: A']);
  });
});
