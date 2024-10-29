import { ElkNode } from 'elkjs';
import React from 'react';

import Ast from '../chevrotain/ast';
import { Point } from './interfaces';
import SvgLink from './svg-link';
import { NodeShape, TextSpan } from './svg-node';
import SvgText from './svg-text';

const Svg = (props: { ast: Ast; elkNode: ElkNode }) => {
  const { ast, elkNode } = props;
  const width = parseFloat(elkNode.width!.toFixed(1));
  const height = parseFloat(elkNode.height!.toFixed(1));

  const shapes: React.JSX.Element[] = [];
  const shapeTexts: React.JSX.Element[] = [];
  const links: React.JSX.Element[] = [];
  const labels: React.JSX.Element[] = [];
  const labelTexts: React.JSX.Element[] = [];

  for (const n of elkNode.children ?? []) {
    const frame = {
      x: parseFloat(n.x!.toFixed(1)),
      y: parseFloat(n.y!.toFixed(1)),
      width: parseFloat(n.width!.toFixed(1)),
      height: parseFloat(n.height!.toFixed(1)),
    };
    // node shape
    shapes.push(<NodeShape key={n.id} frame={frame} />);
    // node label text
    shapeTexts.push(
      <SvgText key={n.id} text={n.labels[0].text} frame={frame} />,
    );
  }

  for (const e of elkNode.edges ?? []) {
    // link
    const points: Point[] = e.sections
      ?.reduce<Point[]>(
        (r, s) => [...r, s.startPoint, ...(s.bendPoints ?? []), s.endPoint],
        [],
      )
      .map((p) => ({
        x: parseFloat(p.x.toFixed(1)),
        y: parseFloat(p.y.toFixed(1)),
      }))
      // remove adjacent duplicates
      .filter((p, i, a) => i === 0 || p.x !== a[i - 1].x || p.y !== a[i - 1].y);
    links.push(
      <SvgLink key={e.id} points={points} astLink={ast.getLink(e.id)} />,
    );

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
    labels.push(<TextSpan key={e.id} frame={frame} />);
    // label text
    labelTexts.push(<SvgText key={e.id} text={label.text!} frame={frame} />);
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {ast.links.some((l) => l.props.direction !== 'none') && (
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
