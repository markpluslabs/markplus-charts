import { ElkNode } from 'elkjs';

export function generateSvg(layout: ElkNode): string {
  const svgWidth = layout.width;
  const svgHeight = layout.height;

  // Start building the SVG content
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" fill="none" stroke="black" stroke-width="1">`;

  // Add arrowhead marker definition once
  svgContent += `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="7" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  `;

  // Draw nodes (rectangles)
  layout.children?.forEach((node) => {
    const { id, x, y, width, height } = node;
    svgContent += `<rect id="${id}" x="${x}" y="${y}" width="${width}" height="${height}" fill="lightblue" stroke="black" />`;
  });

  // Draw edges (lines with arrowheads)
  layout.edges?.forEach((edge) => {
    edge.sections?.forEach((section) => {
      const { startPoint, endPoint, bendPoints } = section;
      let path = `M ${startPoint.x} ${startPoint.y} `;

      // Handle bend points if they exist
      if (bendPoints) {
        bendPoints.forEach((bendPoint) => {
          path += `L ${bendPoint.x} ${bendPoint.y} `;
        });
      }

      // Add the final segment to the end point
      path += `L ${endPoint.x} ${endPoint.y}`;

      // Add path with the arrowhead marker
      svgContent += `<path d="${path}" fill="none" stroke="black" marker-end="url(#arrowhead)" />`;
    });
  });

  svgContent += `</svg>`;

  return svgContent;
}
