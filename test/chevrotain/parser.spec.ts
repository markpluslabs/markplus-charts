import { describe, expect, test } from 'vitest';

import lexer from '../../src/chevrotain/lexer';
import parser from '../../src/chevrotain/parser';

describe('parser', () => {
  test('default', () => {
    const input = 'A{prop3: c; prop4: d} ->{prop1: 4} B{prop2: 5}';
    const r = lexer.tokenize(input);
    parser.input = r.tokens;
    const cst = parser.parse();
    if (parser.errors.length > 0) {
      console.log(parser.errors);
    }
    expect(parser.errors.length).toBe(0);
    expect(cst.children.statements.length).toBe(1);
  });
});
