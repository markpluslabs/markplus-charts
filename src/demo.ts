import { writeFileSync } from 'fs';

import { generate } from '.';

const main = async () => {
  const input = `
// global settings
direction: down
routingStyle: splines
spacing: 64
nodePadding: 32
borderWidth: 2
linkStyle: dashed
nodeShape: circle

A{label: Christmas; radius: 8; padding: 8}
B{label: Go shopping}
C{label: Let me\\nthink; shape: diamond}
// You will need to escape "//":
D{label: Laptop https:\\//example.com; shape: ellipse}
E{label: iPhone} // line end comment
F{
label: Car // comment
shape: circle
}
Z{label: stand alone}

A -> B
B ->{style: dashed} C
C ->{label: One; style: dotted} D
C ->{label: Two} E
C ->{label: Three} F
F ->{direction:both} A
`;

  const svgStr = await generate(input, true);
  writeFileSync('demo.svg', svgStr);
};
main();
