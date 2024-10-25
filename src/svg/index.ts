import SvgEdge from './svg-edge';
import SvgLabel from './svg-label';
import SvgNode from './svg-node';

class Svg {
  width: number;
  height: number;
  nodes: SvgNode[] = [];
  edges: SvgEdge[] = [];
  labels: SvgLabel[] = [];

  // todo: do not add arrowhead if no edge is directional
  toString(): string {
    let r = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
<defs>
  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
  </marker>
</defs>`;
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
