import { describe, expect, test } from 'vitest';

import { generateAst } from '../../src/chevrotain';

describe('visitor', () => {
  test('default', () => {
    const input = 'A{prop3: c; prop4: d} -->{prop1: 4} B{prop2: 5}';
    const ast = generateAst(input);
    expect(ast.plainObject).toEqual({
      nodes: [
        { id: 'A', props: { prop3: 'c', prop4: 'd' } },
        { id: 'B', props: { prop2: '5' } },
      ],
      links: [{ id: 'A-B', from: 'A', to: 'B', props: { prop1: '4' } }],
    });
  });
  test('single node', () => {
    const ast = generateAst('A');
    expect(ast.plainObject).toEqual({
      nodes: [{ id: 'A', props: {} }],
      links: [],
    });
  });

  test('single node with props', () => {
    const ast = generateAst('A{b: c}');
    expect(ast.plainObject).toEqual({
      nodes: [{ id: 'A', props: { b: 'c' } }],
      links: [],
    });
  });

  test('trailing space in propValue', () => {
    const ast = generateAst('A{b: c }');
    expect(ast.plainObject).toEqual({
      nodes: [{ id: 'A', props: { b: 'c' } }],
      links: [],
    });
  });
});
