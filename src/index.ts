import { writeFileSync } from 'fs';

import ELK, { ElkNode } from 'elkjs';

import { generateSvg } from './svg';

const elk = new ELK();

declare module 'elkjs' {
  interface ElkNode {
    label?: string;
  }
}

const graph: ElkNode = {
  id: 'root',
  layoutOptions: { 'elk.algorithm': 'layered' },
  children: [
    { id: 'n1', width: 120, height: 60, label: 'Hello world' },
    { id: 'n2', width: 120, height: 60, label: 'AAA\nBBB\nCCC\nDDD\nEEE' },
    { id: 'n3', width: 120, height: 60, label: 'Christmas' },
  ],
  edges: [
    { id: 'e1', sources: ['n1'], targets: ['n2'] },
    { id: 'e2', sources: ['n1'], targets: ['n3'] },
  ],
};

(async () => {
  const layout = await elk.layout(graph);
  console.log(JSON.stringify(layout, null, 2));
  const svg = generateSvg(layout);
  console.log(svg);
  writeFileSync('temp.svg', svg);
})();
