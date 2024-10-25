import { writeFileSync } from 'fs';

import { generateAst } from './chevrotain';
import { layout } from './elk';

const main = async () => {
  const input = `
A -->|Go| B
B -->|first line\nsecond line\nthird line| C
`;

  const ast = generateAst(input);

  const svg = await layout(ast, {
    direction: 'DOWN',
    node: { hPadding: 24, vPadding: 16 },
  });

  writeFileSync('temp.svg', svg.toString());
};
main();
