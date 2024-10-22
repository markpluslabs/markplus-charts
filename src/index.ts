import { writeFileSync } from 'fs';

import ELK from 'elkjs';

import { generateSvg } from './svg';

const elk = new ELK();

const graph = {
  id: 'root',
  layoutOptions: { 'elk.algorithm': 'layered' },
  children: [
    { id: 'n1', width: 30, height: 30 },
    { id: 'n2', width: 30, height: 30 },
    { id: 'n3', width: 30, height: 30 },
  ],
  edges: [
    { id: 'e1', sources: ['n1'], targets: ['n2'] },
    { id: 'e2', sources: ['n1'], targets: ['n3'] },
  ],
};

(async () => {
  const layout = await elk.layout(graph);
  const svg = generateSvg(layout);
  console.log(svg);
  writeFileSync('output.svg', svg);
})();
