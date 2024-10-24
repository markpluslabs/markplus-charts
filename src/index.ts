import { writeFileSync } from 'fs';

import ELK, { ElkNode } from 'elkjs';

import { toAst } from './chevrotain';
import { generateSvg } from './svg';

const input = `
  A --> B
  B --> C
  A --> C
  B --> D
`;

const ast = toAst(input);

const elk = new ELK();

const graph: ElkNode = {
  id: 'root',
  layoutOptions: {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT', // or DOWN/UP/LEFT
    'elk.edgeRouting': 'SPLINES',
    'elk.layered.spacing.baseValue': '64', // todo: generate this value based on average node size
    'elk.edgeLabels.inline': 'true', // show edge label right on the edge
    'elk.layered.crossingMinimization.semiInteractive': 'true', // preserve sub-nodes order
  },
  children: ast.nodes.map((n, index) => ({
    id: n.id,
    width: 120,
    height: 60,
    layoutOptions: { 'elk.position': `(${index},${index})` }, // preserve sub-nodes order
    labels: [{ text: n.label }],
  })),
  edges: ast.edges.map((e, index) => ({
    id: `e_${index}`,
    sources: [e.from],
    targets: [e.to],
    labels: [
      {
        id: `e_${index}_label`,
        text: 'Label',
        width: '100',
        height: '30',
      },
    ],
  })),
};

(async () => {
  const layout = await elk.layout(graph);
  console.log(JSON.stringify(layout, null, 2));
  const svg = generateSvg(layout);
  console.log(svg);
  writeFileSync('temp.svg', svg);
})();
