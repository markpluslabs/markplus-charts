import { writeFileSync } from 'fs';

import { generate } from '.';

const main = async () => {
  const input = `
A{label: Christmas}
B{label: Go shopping}
C{label: Let me\nthink; shape: circle}
// You will need to escape "//":
D{label: Laptop https:\\//example.com; shape: circle}
E{label: iPhone} // line end comment
F{
label: Car; // comment
shape: circle
}
Z{label: stand alone}

A --> B
B --> C
C -->{label: One} D
C -->{label: Two} E
C -->{label: Three} F
F --> A
`;

  const svgStr = await generate(input);
  writeFileSync('demo.svg', svgStr);
};
main();
