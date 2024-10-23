import { ElkNode } from 'elkjs';

// Constants for "Courier New" font
const BASELINE_RATIO = 0.75; // Baseline is 75% of the line height
const FONT_SIZE = 12; // Font size in pixels
const LINE_HEIGHT = FONT_SIZE * 1.2; // Approximate line height (slightly larger than font size)

export const generateSvg = (layout: ElkNode): string => {
  const svgWidth = layout.width;
  const svgHeight = layout.height;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" fill="none" stroke="black" stroke-width="1">`;
  svgContent += `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  `;

  // Draw nodes (rectangles with centered text)
  layout.children?.forEach((node) => {
    const { id, x, y, width, height } = node;
    const lines: string[] = node['label']!.split('\n'); // Split the name into multiple lines if necessary
    const totalTextHeight = lines.length * LINE_HEIGHT; // Total height of the multiline text block
    const centerY = y! + height! / 2; // Vertical center of the rectangle

    // Calculate the starting y-position of the first line of text
    const startY = centerY - totalTextHeight / 2 + BASELINE_RATIO * LINE_HEIGHT;

    // Add rectangle for the node
    svgContent += `
      <rect id="${id}" x="${x}" y="${y}" width="${width}" height="${height}" stroke="black" />
    `;

    // Add multiline text using <tspan> elements
    svgContent += `<text x="${x! + width! / 2}" font-family="Courier New" font-size="${FONT_SIZE}" text-anchor="middle">`;
    lines.forEach((line, index) => {
      const lineY = startY + index * LINE_HEIGHT; // Position each line properly
      svgContent += `<tspan x="${x! + width! / 2}" y="${lineY}">${line}</tspan>`;
    });
    svgContent += `</text>`;
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
  });

  svgContent += `</svg>`;
  return svgContent;
};
