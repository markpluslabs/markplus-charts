/** @jsx jsx */
import { ElkNode } from 'elkjs';
import { jsx } from 'jsx2str';

import Ast from '../chevrotain/ast';
import { Point } from './interfaces';
import SvgLink from './svg-link';
import { NodeShape, RectShape } from './svg-node';
import SvgText from './svg-text';

const Svg = (props: { ast: Ast; elkNode: ElkNode }): string => {
  const { ast, elkNode } = props;
  const width = parseFloat(elkNode.width!.toFixed(1));
  const height = parseFloat(elkNode.height!.toFixed(1));

  const shapes: string[] = [];
  const shapeTexts: string[] = [];
  const links: string[] = [];
  const labels: string[] = [];
  const labelTexts: string[] = [];

  for (const n of elkNode.children ?? []) {
    const frame = {
      x: parseFloat(n.x!.toFixed(1)),
      y: parseFloat(n.y!.toFixed(1)),
      width: parseFloat(n.width!.toFixed(1)),
      height: parseFloat(n.height!.toFixed(1)),
    };
    // node shape
    const astNode = ast.getNode(n.id)!;
    shapes.push(<NodeShape frame={frame} astNode={astNode} />);
    // node label text
    shapeTexts.push(
      <SvgText
        text={n.labels![0].text!}
        frame={frame}
        color={astNode.props.fgColor}
      />,
    );
  }

  for (const e of elkNode.edges ?? []) {
    // link
    const astLink = ast.getLink(e.id)!;
    const points: Point[] = e
      .sections!.reduce<Point[]>(
        (r, s) => [...r, s.startPoint, ...(s.bendPoints ?? []), s.endPoint],
        [],
      )
      .map((p) => ({
        x: parseFloat(p.x.toFixed(1)),
        y: parseFloat(p.y.toFixed(1)),
      }))
      // remove adjacent duplicates
      .filter((p, i, a) => i === 0 || p.x !== a[i - 1].x || p.y !== a[i - 1].y);
    links.push(<SvgLink points={points} astLink={astLink} />);

    // label
    if (!(e.labels && e.labels.length > 0)) {
      continue;
    }
    const label = e.labels[0];
    const { x, y, width, height } = label;
    const frame = {
      x: parseFloat(x!.toFixed(1)),
      y: parseFloat(y!.toFixed(1)),
      width: parseFloat(width!.toFixed(1)),
      height: parseFloat(height!.toFixed(1)),
    };
    labels.push(
      <RectShape
        frame={frame}
        svgProps={{
          stroke: 'none',
          strokeWidth: 0,
          fill: astLink.props.bgColor,
        }}
      />,
    );
    // label text
    labelTexts.push(
      <SvgText
        text={label.text!}
        frame={frame}
        color={astLink.props.fgColor}
      />,
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {ast.props.bgColor && ast.props.bgColor !== 'none' && (
        <rect width="100%" height="100%" fill={ast.props.bgColor} />
      )}
      {ast.links.some((l) => l.props.arrowHeads !== 'none') && (
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto-start-reverse"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
      )}
      {shapes}
      {shapeTexts}
      {links}
      {labels}
      {labelTexts}
    </svg>
  );
};

export default Svg;
