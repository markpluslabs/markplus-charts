import { ElkNode } from 'elkjs';

import SvgLabel from './svg-label';
import SvgNode from './svg-node';

export const generateSvg = (layout: ElkNode): string => {
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">`;
  svgContent += `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  `;

  // Draw nodes (rectangles with centered text)
  layout.children?.forEach((node) => {
    const { x, y, width, height } = node;
    const svgNode = new SvgNode(
      { x: x!, y: y!, width: width!, height: height! },
      { fill: 'none', stroke: 'black', strokeWidth: 1 },
    );
    svgContent += svgNode.toSvg();
    const label = new SvgLabel(node.labels![0].text!, svgNode);
    svgContent += label.toSvg();
  });

  // Draw edges (lines with arrowheads)
  layout.edges?.forEach((edge) => {
    edge.sections?.forEach((section) => {
      const { startPoint, endPoint, bendPoints } = section;
      let path = `M ${startPoint.x} ${startPoint.y} `;
      if (bendPoints) {
        bendPoints.forEach((bendPoint) => {
          path += `L ${bendPoint.x} ${bendPoint.y} `;
        });
      }
      path += `L ${endPoint.x} ${endPoint.y}`;
      svgContent += `<path d="${path}" fill="none" stroke="black" marker-end="url(#arrowhead)" />`;
    });
    if (edge.labels && edge.labels.length > 0) {
      const label = edge.labels[0];
      const { x, y, width, height } = label;
      const svgNode = new SvgNode(
        { x: x!, y: y!, width: width!, height: height! },
        { fill: 'lightgray', stroke: 'none', strokeWidth: 0 },
      );
      svgContent += svgNode.toSvg();
      const svgLabel = new SvgLabel(edge.labels[0].text!, svgNode);
      svgContent += svgLabel.toSvg();
    }
  });

  svgContent += `</svg>`;
  return svgContent;
};
