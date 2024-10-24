import { ElkNode } from 'elkjs';

import SvgLabel from './svg-label';
import SvgNode from './svg-node';
import SvgEdge from './svgEdge';

export const toSvg = (layout: ElkNode): string => {
  let r = `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">`;
  r += `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  `;

  layout.children?.forEach((node) => {
    // node
    const { x, y, width, height } = node;
    const svgNode = new SvgNode(
      { x: x!, y: y!, width: width!, height: height! },
      { fill: 'none', stroke: 'black', strokeWidth: 1 },
    );
    r += svgNode.toSvg();

    // node label
    const label = new SvgLabel(node.labels![0].text!, svgNode);
    r += label.toSvg();
  });

  layout.edges?.forEach((edge) => {
    // edge
    const points: { x: number; y: number }[] = [];
    edge.sections?.forEach((section) => {
      const { startPoint, endPoint, bendPoints } = section;
      points.push(startPoint, ...(bendPoints ?? []), endPoint);
    });
    const svgEdge = new SvgEdge(points);
    r += svgEdge.toSvg();

    // edge label
    if (edge.labels && edge.labels.length > 0) {
      // label background
      const label = edge.labels[0];
      const { x, y, width, height } = label;
      const svgNode = new SvgNode(
        { x: x!, y: y!, width: width!, height: height! },
        { fill: 'lightgray', stroke: 'none', strokeWidth: 0 },
      );
      r += svgNode.toSvg();

      // label text
      const svgLabel = new SvgLabel(edge.labels[0].text!, svgNode);
      r += svgLabel.toSvg();
    }
  });

  r += `</svg>`;
  return r;
};
