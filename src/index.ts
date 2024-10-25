import { writeFileSync } from 'fs';

import ELK, { ElkNode } from 'elkjs';

import { toAst } from './chevrotain';
import CONSTS from './consts';
import { toSvg } from './svg';

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

const ast = toAst(input);

console.log(JSON.stringify(ast, null, 2));

const elk = new ELK();

const getTextSize = (text: string) => {
  const lines = text.split('\n');
  const width =
    CONSTS.CHARACTER_WIDTH * Math.max(...lines.map((line) => line.length));
  const height = CONSTS.LINE_HEIGHT * lines.length;
  return { width, height };
};
const hPadding = 24;
const vPadding = 16;
const addPadding = (size: { width: number; height: number }) => ({
  width: size.width + hPadding * 2,
  height: size.height + vPadding * 2,
});

const graph: ElkNode = {
  id: 'root',
  children: ast.nodes.map((n, index) => ({
    id: n.id,
    ...addPadding(getTextSize(n.label)),
    layoutOptions: { 'elk.position': `(${index},${index})` }, // preserve sub-nodes order
    labels: [{ text: n.label }],
  })),
  edges: ast.edges.map((e, index) => ({
    id: `e_${index}`,
    sources: [e.from],
    targets: [e.to],
    directional: e.directional,
    labels: [
      {
        id: `e_${index}_label`,
        text: 'Label\nLabel😀',
        ...getTextSize('Label\nLabel😀'),
      },
    ],
  })),
};

(async () => {
  const layout = await elk.layout(graph, {
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN', // or DOWN/UP/LEFT
      'elk.edgeRouting': 'SPLINES',
      'elk.layered.spacing.baseValue': '64', // todo: generate this value based on average node size
      'elk.edgeLabels.inline': 'true', // show edge label right on the edge
      'elk.layered.crossingMinimization.semiInteractive': 'true', // preserve sub-nodes order
    },
  });
  console.log(JSON.stringify(layout, null, 2));
  const svg = toSvg(layout);
  console.log(svg);
  writeFileSync('temp.svg', svg);
})();
