import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs';

import Ast from '../chevrotain/ast';
import CONSTS from '../consts';
import Svg from '../svg';
import SvgEdge from '../svg/svg-edge';
import SvgLabel from '../svg/svg-label';
import SvgNode from '../svg/svg-node';

const getTextSize = (text: string) => {
  const lines = text.split('\n');
  const width =
    CONSTS.CHARACTER_WIDTH * Math.max(...lines.map((line) => line.length));
  const height = CONSTS.LINE_HEIGHT * lines.length;
  return { width, height };
};

interface LayoutConfig {
  direction: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';
  node: {
    hPadding: number;
    vPadding: number;
  };
}

export const layout = async (ast: Ast, config: LayoutConfig): Promise<Svg> => {
  ast.createIndex();
  const addPadding = (size: { width: number; height: number }) => ({
    width: size.width + config.node.hPadding * 2,
    height: size.height + config.node.vPadding * 2,
  });
  const elk = new ELK();
  const elkNode = await elk.layout(
    {
      id: 'root',
      children: ast.nodes.map((n, index) => {
        const r: ElkNode = {
          id: n.id,
          ...addPadding(getTextSize(n.label)),
          layoutOptions: { 'elk.position': `(${index},${index})` }, // preserve sub-nodes order
          labels: [{ text: n.label }],
        };
        return r;
      }),
      edges: ast.edges.map((e) => {
        const r: ElkExtendedEdge = {
          id: e.id,
          sources: [e.from],
          targets: [e.to],
          labels: [
            {
              id: `${e.id}_label`,
              text: 'Label\nLabel😀',
              ...getTextSize('Label\nLabel😀'),
            },
          ],
        };
        return r;
      }),
    },
    {
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': config.direction,
        'elk.edgeRouting': 'SPLINES',
        'elk.layered.spacing.baseValue': '64', // todo: generate this value based on average node size
        'elk.edgeLabels.inline': 'true', // show edge label right on the edge
        'elk.layered.crossingMinimization.semiInteractive': 'true', // preserve sub-nodes order
      },
    },
  );

  const svg = new Svg();
  elkNode.children?.forEach((node) => {
    // node
    const { x, y, width, height } = node;
    const svgNode = new SvgNode(
      { x: x!, y: y!, width: width!, height: height! },
      { fill: 'none', stroke: 'black', strokeWidth: 1 },
    );
    svg.nodes.push(svgNode);

    // node label
    const svgLabel = new SvgLabel(node.labels![0].text!, svgNode);
    svg.labels.push(svgLabel);
  });

  elkNode.edges?.forEach((edge) => {
    // edge
    const points: { x: number; y: number }[] = [];
    edge.sections?.forEach((section) => {
      const { startPoint, endPoint, bendPoints } = section;
      points.push(startPoint, ...(bendPoints ?? []), endPoint);
    });
    const svgEdge = new SvgEdge(points, ast.getEdge(edge.id!)!.directional);
    svg.edges.push(svgEdge);

    // edge label
    if (edge.labels && edge.labels.length > 0) {
      // label background
      const label = edge.labels[0];
      const { x, y, width, height } = label;
      const svgNode = new SvgNode(
        { x: x!, y: y!, width: width!, height: height! },
        { fill: 'lightgray', stroke: 'none', strokeWidth: 0 },
      );
      svg.nodes.push(svgNode);

      // label text
      const svgLabel = new SvgLabel(edge.labels[0].text!, svgNode);
      svg.labels.push(svgLabel);
    }
  });

  return svg;
};
