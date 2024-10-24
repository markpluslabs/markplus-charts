import { ElkNode } from 'elkjs';

import Label from './label';

export const generateSvg = (layout: ElkNode): string => {
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}" fill="none" stroke="black" stroke-width="1">`;
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
    svgContent += `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" />
  `;
    const label = new Label(node.labels![0].text!, {
      x: x!,
      y: y!,
      width: width!,
      height: height!,
    });
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
      svgContent += `<path d="${path}" fill="none" marker-end="url(#arrowhead)" />`;
    });
    if (edge.labels && edge.labels.length > 0) {
      const _label = edge.labels[0];
      const { x, y, width, height } = _label;
      svgContent += `
      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="lightgray" stroke="none" />
    `;
      const label = new Label(edge.labels[0].text!, {
        x: _label.x!,
        y: _label.y!,
        width: _label.width!,
        height: _label.height!,
      });
      svgContent += label.toSvg();
    }
  });

  svgContent += `</svg>`;
  return svgContent;
};
