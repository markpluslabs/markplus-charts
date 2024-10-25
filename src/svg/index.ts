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
    this.width = parseFloat(elkNode.width!.toFixed(1));
    this.height = parseFloat(elkNode.height!.toFixed(1));

    elkNode.children?.forEach((node) => {
      // node
      const { x, y, width, height } = node;
      const svgNode = new SvgNode(
        {
          x: parseFloat(x!.toFixed(1)),
          y: parseFloat(y!.toFixed(1)),
          width: parseFloat(width!.toFixed(1)),
          height: parseFloat(height!.toFixed(1)),
        },
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
      points.forEach((point) => {
        point.x = parseFloat(point.x.toFixed(1));
        point.y = parseFloat(point.y.toFixed(1));
      });
      const svgEdge = new SvgEdge(points, ast.getEdge(edge.id!)!.directional);
      this.edges.push(svgEdge);

      // edge label
      if (edge.labels && edge.labels.length > 0) {
        // label background
        const label = edge.labels[0];
        const { x, y, width, height } = label;
        const svgNode = new SvgNode(
          {
            x: parseFloat(x!.toFixed(1)),
            y: parseFloat(y!.toFixed(1)),
            width: parseFloat(width!.toFixed(1)),
            height: parseFloat(height!.toFixed(1)),
          },
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

    // edges must be rendered before everything else
    this.edges.forEach((edge) => {
      r += '\n' + edge.toString();
    });

    this.nodes.forEach((node) => {
      r += '\n' + node.toString();
    });

    // labels must be rendered after everything else
    this.labels.forEach((label) => {
      r += '\n' + label.toString();
    });

    r += `\n</svg>`;
    return r;
  }
}

export default Svg;
