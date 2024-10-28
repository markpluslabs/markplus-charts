import { writeFileSync } from 'fs';

import { generateAst } from './chevrotain';
import { layout } from './elk';

const main = async () => {
  const input = `
Christmas --> B{label: Go shopping}
B --> C{label: Let me
think}
C -->{
  label: One
} Laptop
C -->{label: Two} iPhone
C -->{label: Three} Car
`;

  const ast = generateAst(input);

  const svg = await layout(ast, {
    direction: 'LEFT',
    node: { hPadding: 24, vPadding: 16 },
  });

  writeFileSync('demo.svg', svg.toString());
};
main();
