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

declare module 'elkjs' {
  interface ElkNode {
    label?: string;
  }
}

const graph: ElkNode = {
  id: 'root',
  layoutOptions: {
    'elk.algorithm': 'layered',
    'elk.direction': 'RIGHT', // or DOWN
    'elk.edgeRouting': 'SPLINES',
    'elk.layered.spacing.baseValue': '64', // todo: generate this value based on average node size
    'elk.edgeLabels.inline': 'true', // show edge label right on the label
    'elk.layered.crossingMinimization.semiInteractive': 'true', // preserve sub-nodes order
  },
  children: ast.nodes.map((n, index) => ({
    id: n.id,
    width: 120,
    height: 60,
    label: n.label,
    layoutOptions: { 'elk.position': `(${index},${index})` }, // preserve sub-nodes order
  })),
  edges: ast.edges.map((e, index) => ({
    id: `e${index}`,
    sources: [e.from],
    targets: [e.to],
    labels: [
      {
        id: index + '_label',
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
