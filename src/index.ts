import { writeFileSync } from 'fs';

import { generateAst } from './chevrotain';
import { layout } from './elk';

const main = async () => {
  const input = `
A{label:Step 1} -->{label:Step 2;direction: both} B{label:Step 3}
`;

  const ast = generateAst(input);

  const svg = await layout(ast, {
    direction: 'DOWN',
    node: { hPadding: 24, vPadding: 16 },
  });

  writeFileSync('demo.svg', svg.toString());
};
main();
