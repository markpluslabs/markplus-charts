import ELK, { ElkExtendedEdge, ElkNode } from "elkjs";

import Ast from "../chevrotain/ast.js";
import CONSTS from "../consts.js";

function getStringWidth(str: string): number {
  let totalWidth = 0;

  for (const char of str) {
    // Get the Unicode code point of the character
    const codePoint = char.codePointAt(0);

    // Check if the character is in the full-width or wide ranges
    if (
      // Full-width ASCII variants (U+FF01 to U+FF60, U+FFE0 to U+FFE6)
      (codePoint >= 0xFF01 && codePoint <= 0xFF60) ||
      (codePoint >= 0xFFE0 && codePoint <= 0xFFE6) ||
      // CJK Unified Ideographs (U+4E00 to U+9FFF)
      (codePoint >= 0x4E00 && codePoint <= 0x9FFF) ||
      // Hangul Syllables (U+AC00 to U+D7AF)
      (codePoint >= 0xAC00 && codePoint <= 0xD7AF) ||
      // Emoji and other wide characters
      (codePoint >= 0x1F600 && codePoint <= 0x1F64F) || // Emoticons
      (codePoint >= 0x1F300 && codePoint <= 0x1F5FF) || // Miscellaneous Symbols and Pictographs
      (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) // Supplemental Symbols and Pictographs
    ) {
      totalWidth += 2; // Full-width or wide character
    } else {
      totalWidth += 1; // Narrow or half-width character
    }
  }

  return totalWidth;
}

const getTextSize = (text: string) => {
  const lines = text.split("\n");
  const width = CONSTS.CHARACTER_WIDTH *
    Math.max(...lines.map((line) => getStringWidth(line)));
  const height = CONSTS.LINE_HEIGHT * lines.length;
  return { width, height };
};

export const layout = async (ast: Ast, debug = false): Promise<ElkNode> => {
  const elk = new ELK.default();
  if (debug) {
    console.log(JSON.stringify(ast, null, 2));
    const temp = elk.layout.bind(elk);
    elk.layout = async (graph, options) => {
      console.log(JSON.stringify({ graph, options }, null, 2));
      const result = await temp(graph, options);
      console.log(JSON.stringify(result, null, 2));
      return result;
    };
  }
  let direction = ast.props.direction?.toUpperCase();
  if (!["UP", "DOWN", "LEFT", "RIGHT"].includes(direction)) {
    direction = "RIGHT";
  }
  let routingStyle = ast.props.routingStyle?.toUpperCase();
  if (!["ORTHOGONAL", "POLYLINE", "SPLINES"].includes(routingStyle)) {
    routingStyle = "ORTHOGONAL";
  }
  let spacing = parseInt(ast.props.spacing ?? "64");
  if (isNaN(spacing)) {
    spacing = 64;
  }
  spacing = Math.max(spacing, 16);
  const elkNode = await elk.layout(
    {
      id: "root",
      children: ast.nodes.map((n, idx) => {
        const label = n.props.label || n.id;
        let { width, height } = getTextSize(label);
        width += n.hPadding * 2 + n.borderWidth * 2;
        height += n.vPadding * 2 + n.borderWidth * 2;
        const regularShaped = ["circle", "diamond"].includes(n.props.shape); // width === height
        if (regularShaped) {
          width = height = Math.max(width, height);
        }
        const r: ElkNode = {
          id: n.id,
          width,
          height,
          labels: [{ text: label }],
          ports: [
            {
              id: `${n.id}_u`,
              x: width / 2,
              y: 0,
            },
            {
              id: `${n.id}_r`,
              x: width,
              y: height / 2,
            },
            {
              id: `${n.id}_d`,
              x: width / 2,
              y: height,
            },
            {
              id: `${n.id}_l`,
              x: 0,
              y: height / 2,
            },
          ],
          properties: {
            portConstraints: "FIXED_POS",
            partition: idx > 0 ? 1 : 0, // first node always first
          },
        };
        return r;
      }),
      edges: ast.links.map((e) => {
        let sourcePort = "";
        let targetPort = "";
        switch (direction) {
          case "DOWN": {
            sourcePort = `${e.from}_d`;
            targetPort = `${e.to}_u`;
            break;
          }
          case "UP": {
            sourcePort = `${e.from}_u`;
            targetPort = `${e.to}_d`;
            break;
          }
          case "LEFT": {
            sourcePort = `${e.from}_l`;
            targetPort = `${e.to}_r`;
            break;
          }
          case "RIGHT": {
            sourcePort = `${e.from}_r`;
            targetPort = `${e.to}_l`;
            break;
          }
        }
        const r: ElkExtendedEdge = {
          id: e.id,
          sources: [sourcePort],
          targets: [targetPort],
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
        algorithm: "layered",
        "elk.direction": direction,
        edgeRouting: routingStyle,
        "spacing.baseValue": String(spacing),
        "edgeLabels.inline": "true",

        // to preserve the order of nodes in the same layer
        "crossingMinimization.forceNodeModelOrder": "true",
        // below is required: https://github.com/kieler/elkjs/issues/304
        "considerModelOrder.strategy": "NODES_AND_EDGES",

        // to make first node always appear in first layer
        "partitioning.activate": "true",

        // todo: https://github.com/kieler/elkjs/issues/304
        // to make long edges choose the shorter path. This is not needed in future versions of ELK
        "considerModelOrder.longEdgeStrategy": "DUMMY_NODE_UNDER",
      },
    },
  );
  return elkNode;
};
