import { writeFileSync } from 'fs';

import { generate } from '.';

const main = async () => {
  const input = `
// global settings
direction: up;
nodePadding: 64 32;

A{label: Christmas; radius: 8}
B{label: Go shopping}
C{label: Let me\\nthink; shape: diamond}
// You will need to escape "//":
D{label: Laptop https:\\//example.com; shape: ellipse}
E{label: iPhone} // line end comment
F{
label: Car; // comment
shape: circle
}
Z{label: stand alone}

A -> B
B ->{style: dashed;} C
C ->{label: One; style: dotted;} D
C ->{label: Two} E
C ->{label: Three;direction:none} F
F ->{direction:both;} A
`;

  const svgStr = await generate(input, true);
  writeFileSync('demo.svg', svgStr);
};
main();
