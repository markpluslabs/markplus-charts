import { writeFileSync } from 'fs';

import { generateAst } from './chevrotain';
import { layout } from './elk';

const main = async () => {
  const input = `
A{label: Christmas}
B{label: Go shopping}
C{label: Let me\nthink}
D{label: Laptop https:\\//example.com}
E{label: iPhone} // line end comment
// line comment
F{
label: Car // comment
}

A --> B
B --> C
C -->{label: One} D
C -->{label: Two} E
C -->{label: Three} F
F --> A
`;

  const ast = generateAst(input);

  const svg = await layout(ast, {
    debug: true,
    direction: 'DOWN',
    node: { hPadding: 24, vPadding: 16 },
  });

  writeFileSync('demo.svg', svg.toString());
};
main();
