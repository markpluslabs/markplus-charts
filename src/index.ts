import { writeFileSync } from 'fs';

import { generateAst } from './chevrotain';
import { layout } from './elk';

const main = async () => {
  const input = `
A --> B
B --> C
C --> D
C --> E
C --> F
F --> A
`;

  const ast = generateAst(input);

  const svg = await layout(ast, {
    direction: 'DOWN',
    node: { hPadding: 24, vPadding: 16 },
  });

  writeFileSync('temp.svg', svg.toString());
};
main();
