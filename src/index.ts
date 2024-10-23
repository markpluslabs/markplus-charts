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
  layoutOptions: { 'elk.algorithm': 'layered' },
  children: ast.nodes.map((n) => ({
    id: n.id,
    width: 120,
    height: 60,
    label: n.label,
  })),
  edges: ast.edges.map((e, idx) => ({
    id: `e${idx}`,
    sources: [e.from],
    targets: [e.to],
  })),
};

(async () => {
  const layout = await elk.layout(graph);
  console.log(JSON.stringify(layout, null, 2));
  const svg = generateSvg(layout);
  console.log(svg);
  writeFileSync('temp.svg', svg);
})();
