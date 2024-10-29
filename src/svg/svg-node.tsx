import React from 'react';

import { Rect, SvgProps } from './interfaces';

const SvgNode = (props: { frame: Rect; svgProps: SvgProps }) => {
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

export const NodeShape = (props: { frame: Rect }) => {
  return (
    <SvgNode
      frame={props.frame}
      svgProps={{ fill: 'none', stroke: 'black', strokeWidth: 1 }}
    />
  );
};

export const TextSpan = (props: { frame: Rect }) => {
  return (
    <SvgNode
      frame={props.frame}
      svgProps={{ fill: 'lightgray', stroke: 'none', strokeWidth: 0 }}
    />
  );
};
