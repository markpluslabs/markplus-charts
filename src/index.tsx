import { writeFileSync } from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { generateAst } from './chevrotain';
import { layout } from './elk';
import Svg from './svg';

const main = async () => {
  const input = `
A{label: Christmas}
B{label: Go shopping}
C{label: Let me\nthink}
// You will need to escape "//":
D{label: Laptop https:\\//example.com}
E{label: iPhone} // line end comment
F{
label: Car // comment
}
Z{label: stand alone}

A --> B
B --> C
C -->{label: One} D
C -->{label: Two} E
C -->{label: Three} F
F --> A
`;

  const ast = generateAst(input);

  const elkNode = await layout(ast, {
    debug: false,
    direction: 'DOWN',
    node: { hPadding: 24, vPadding: 16 },
  });

  const svgStr = ReactDOMServer.renderToString(
    <Svg ast={ast} elkNode={elkNode} />,
  );
  writeFileSync('demo.svg', svgStr);
};
main();
