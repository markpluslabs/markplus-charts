import React from 'react';

import { AstNode } from '../chevrotain/ast';
import { Rect, SvgProps } from './interfaces';

const RectShape = (props: {
  frame: Rect;
  svgProps: React.SVGProps<SVGRectElement>;
}) => {
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
      cx={(frame.x + frame.width / 2).toFixed(1)}
      cy={(frame.y + frame.height / 2).toFixed(1)}
      r={(Math.min(frame.width, frame.height) / 2).toFixed(1)}
      {...svgProps}
    />
  );
};

export const EllipseShape = (props: { frame: Rect; svgProps: SvgProps }) => {
  const { frame, svgProps } = props;
  return (
    <ellipse
      cx={(frame.x + frame.width / 2).toFixed(1)}
      cy={(frame.y + frame.height / 2).toFixed(1)}
      rx={(frame.width / 2).toFixed(1)}
      ry={(frame.height / 2).toFixed(1)}
      {...svgProps}
    />
  );
};

export const DiamondShape = (props: { frame: Rect; svgProps: SvgProps }) => {
  const { frame, svgProps } = props;
  const { x, y, width, height } = frame;
  return (
    <polygon
      points={
        `${(x + width / 2).toFixed(1)},${y}` +
        ` ${(x + width).toFixed(1)},${(y + height / 2).toFixed(1)}` +
        ` ${(x + width / 2).toFixed(1)},${(y + height).toFixed(1)} ` +
        `${x},${(y + height / 2).toFixed(1)}`
      }
      {...svgProps}
    />
  );
};

export const NodeShape = (props: { frame: Rect; astNode: AstNode }) => {
  const { frame, astNode } = props;
  const commonProps = { fill: 'none', stroke: 'black', strokeWidth: 1 };
  switch (astNode.props.shape ?? 'rect') {
    case 'rect': {
      const svgProps = commonProps as React.SVGProps<SVGRectElement>;
      svgProps.rx = svgProps.ry = astNode.props.cornerRadius;
      return <RectShape frame={frame} svgProps={svgProps} />;
    }
    case 'circle':
      return <CircleShape frame={frame} svgProps={commonProps} />;
    case 'ellipse':
      return <EllipseShape frame={frame} svgProps={commonProps} />;
    case 'diamond':
      return <DiamondShape frame={frame} svgProps={commonProps} />;
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
