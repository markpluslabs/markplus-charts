import { ElkNode } from 'elkjs';

import Ast from '../chevrotain/ast';
import SvgEdge from './svg-edge';
import SvgLabel from './svg-label';
import SvgNode from './svg-node';

class Svg {
  width: number;
  height: number;
  nodes: SvgNode[] = [];
  edges: SvgEdge[] = [];
  labels: SvgLabel[] = [];

  constructor(elkNode: ElkNode, ast: Ast) {
    this.width = elkNode.width!;
    this.height = elkNode.height!;

    elkNode.children?.forEach((node) => {
      // node
      const { x, y, width, height } = node;
      const svgNode = new SvgNode(
        { x: x!, y: y!, width: width!, height: height! },
        { fill: 'none', stroke: 'black', strokeWidth: 1 },
      );
      this.nodes.push(svgNode);

      // node label
      const svgLabel = new SvgLabel(node.labels![0].text!, svgNode);
      this.labels.push(svgLabel);
    });

    elkNode.edges?.forEach((edge) => {
      // edge
      const points: { x: number; y: number }[] = [];
      edge.sections?.forEach((section) => {
        const { startPoint, endPoint, bendPoints } = section;
        points.push(startPoint, ...(bendPoints ?? []), endPoint);
      });
      const svgEdge = new SvgEdge(points, ast.getEdge(edge.id!)!.directional);
      this.edges.push(svgEdge);

      // edge label
      if (edge.labels && edge.labels.length > 0) {
        // label background
        const label = edge.labels[0];
        const { x, y, width, height } = label;
        const svgNode = new SvgNode(
          { x: x!, y: y!, width: width!, height: height! },
          { fill: 'lightgray', stroke: 'none', strokeWidth: 0 },
        );
        this.nodes.push(svgNode);

        // label text
        const svgLabel = new SvgLabel(edge.labels[0].text!, svgNode);
        this.labels.push(svgLabel);
      }
    });
  }

  toString(): string {
    let r = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">`;
    if (this.edges.some((edge) => edge.directional)) {
      r += `\n<defs>
  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
  </marker>
</defs>`;
    }
    this.nodes.forEach((node) => {
      r += '\n' + node.toString();
    });
    this.edges.forEach((edge) => {
      r += '\n' + edge.toString();
    });
    this.labels.forEach((label) => {
      r += '\n' + label.toString();
    });
    r += `\n</svg>`;
    return r;
  }
}

export default Svg;
