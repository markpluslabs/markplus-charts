import React from 'react';

import { AstNode } from '../chevrotain/ast';
import { Rect, SvgProps } from './interfaces';

const RectShape = (props: { frame: Rect; svgProps: SvgProps }) => {
  const { frame, svgProps } = props;
  return (
    <rect
      x={frame.x}
      y={frame.y}
      width={frame.width}
      height={frame.height}
      {...svgProps}
    />
  );
};

const CircleShape = (props: { frame: Rect; svgProps: SvgProps }) => {
  const { frame, svgProps } = props;
  return (
    <circle
      cx={frame.x + frame.width / 2}
      cy={frame.y + frame.height / 2}
      r={Math.min(frame.width, frame.height) / 2}
      {...svgProps}
    />
  );
};

export const EllipseShape = (props: { frame: Rect; svgProps: SvgProps }) => {
  const { frame, svgProps } = props;
  return (
    <ellipse
      cx={frame.x + frame.width / 2}
      cy={frame.y + frame.height / 2}
      rx={frame.width / 2}
      ry={frame.height / 2}
      {...svgProps}
    />
  );
};

export const NodeShape = (props: { frame: Rect; astNode: AstNode }) => {
  const { frame, astNode } = props;
  const svgProps = { fill: 'none', stroke: 'black', strokeWidth: 1 };
  switch (astNode.props.shape ?? 'rect') {
    case 'rect':
      return <RectShape frame={frame} svgProps={svgProps} />;
    case 'circle':
      return <CircleShape frame={frame} svgProps={svgProps} />;
    case 'ellipse':
      return <EllipseShape frame={frame} svgProps={svgProps} />;
  }
};

export const TextSpan = (props: { frame: Rect }) => {
  return (
    <RectShape
      frame={props.frame}
      svgProps={{ fill: 'lightgray', stroke: 'none', strokeWidth: 0 }}
    />
  );
};
