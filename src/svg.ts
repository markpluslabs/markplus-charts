import { ElkNode } from 'elkjs';

import CONSTS from './consts';

export const generateSvg = (layout: ElkNode): string => {
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}" fill="none" stroke="black" stroke-width="1">`;
  svgContent += `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  `;

  const drawLabel = (
    label: string,
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
  ) => {
    const { x, y, width, height } = position;
    const lines = label.split('\n'); // Split the name into multiple lines if necessary
    const totalTextHeight = lines.length * CONSTS.LINE_HEIGHT; // Total height of the multiline text block
    const centerY = y + height / 2; // Vertical center of the rectangle
    const startY = centerY - totalTextHeight / 2 + CONSTS.BASELINE_HEIGHT;
    // Add multiline text using <tspan> elements
    svgContent += `<text x="${x + width / 2}" font-family="Courier New" font-size="${CONSTS.FONT_SIZE}" text-anchor="middle">`;
    lines.forEach((line, index) => {
      const lineY = startY + index * CONSTS.LINE_HEIGHT; // Position each line properly
      svgContent += `<tspan x="${x + width / 2}" y="${lineY}">${line}</tspan>`;
    });
    svgContent += `</text>`;
  };

  // Draw nodes (rectangles with centered text)
  layout.children?.forEach((node) => {
    const { id, x, y, width, height } = node;
    svgContent += `
    <rect id="${id}" x="${x}" y="${y}" width="${width}" height="${height}" />
  `;
    drawLabel(node.labels![0].text!, {
      x: x!,
      y: y!,
      width: width!,
      height: height!,
    });
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
      const label = edge.labels[0];
      const { id, x, y, width, height } = label;
      svgContent += `
      <rect id="${id}" x="${x}" y="${y}" width="${width}" height="${height}" fill="lightgray" stroke="none" />
    `;
      drawLabel(label.text!, {
        x: label.x!,
        y: label.y!,
        width: label.width!,
        height: label.height!,
      });
    }
  });

  svgContent += `</svg>`;
  return svgContent;
};
