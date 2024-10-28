import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs';

import Ast from '../chevrotain/ast';
import CONSTS from '../consts';
import Svg from '../svg';

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
  const addPadding = (size: { width: number; height: number }) => ({
    width: size.width + config.node.hPadding * 2,
    height: size.height + config.node.vPadding * 2,
  });
  const elk = new ELK();
  const elkNode = await elk.layout(
    {
      id: 'root',
      children: ast.nodes.map((n) => {
        const label = n.props.label || n.id;
        const { width, height } = addPadding(getTextSize(label));
        const r: ElkNode = {
          id: n.id,
          width,
          height,
          labels: [{ text: label }],
          ports: [
            {
              id: `${n.id}_pn`,
              x: width / 2,
              y: 0,
            },
            {
              id: `${n.id}_ps`,
              x: width / 2,
              y: height,
            },
          ],
          properties: {
            portConstraints: 'FIXED_POS',
          },
        };
        return r;
      }),
      edges: ast.links.map((e) => {
        const r: ElkExtendedEdge = {
          id: e.id,
          // todo: should based on elk.direction
          sources: [`${e.from}_ps`],
          targets: [`${e.to}_pn`],
        };
        if (e.props.label) {
          r.labels = [
            {
              id: `${e.id}_label`,
              text: e.props.label,
              ...getTextSize(e.props.label),
            },
          ];
        }
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
        'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
      },
    },
  );
  const svg = new Svg(elkNode, ast);
  return svg;
};
