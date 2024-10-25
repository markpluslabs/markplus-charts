import { writeFileSync } from 'fs';

import { generateAst } from './chevrotain';
import { layout } from './elk';

const main = async () => {
  // const input = `
  //   A --> Bbbb
  //   Bbbb --> C
  //   A --> C
  //   A --> D
  //   C --> D
  //   D --> A
  // `;

  const input = `
A --- B
B --- A
A --> C
`;

  const ast = generateAst(input);

  const svg = await layout(ast, {
    direction: 'DOWN',
    node: { hPadding: 24, vPadding: 16 },
  });

  writeFileSync('temp.svg', svg.toString());
};
main();
