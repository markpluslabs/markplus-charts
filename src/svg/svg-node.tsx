/** @jsx jsx */
import { jsx } from 'jsx2str';

import { AstNode } from '../chevrotain/ast';
import { Rect, SvgProps } from './interfaces';

const RectShape = (props: {
  frame: Rect;
  svgProps: { [key: string]: number | string };
}): string => {
  const { frame, svgProps } = props;
  const strokeWidth = svgProps.strokeWidth as number;
  return (
    <rect
      x={(frame.x + strokeWidth / 2).toFixed(1)}
      y={(frame.y + strokeWidth / 2).toFixed(1)}
      width={(frame.width - strokeWidth).toFixed(1)}
      height={(frame.height - strokeWidth).toFixed(1)}
      {...svgProps}
    />
  );
};

const CircleShape = (props: { frame: Rect; svgProps: SvgProps }): string => {
  const { frame, svgProps } = props;
  const strokeWidth = svgProps.strokeWidth as number;
  return (
    <circle
      cx={(frame.x + frame.width / 2).toFixed(1)}
      cy={(frame.y + frame.height / 2).toFixed(1)}
      r={(Math.min(frame.width, frame.height) / 2 - strokeWidth / 2).toFixed(1)}
      {...svgProps}
    />
  );
};

export const EllipseShape = (props: {
  frame: Rect;
  svgProps: SvgProps;
}): string => {
  const { frame, svgProps } = props;
  const strokeWidth = svgProps.strokeWidth as number;
  return (
    <ellipse
      cx={(frame.x + frame.width / 2).toFixed(1)}
      cy={(frame.y + frame.height / 2).toFixed(1)}
      rx={(frame.width / 2 - strokeWidth / 2).toFixed(1)}
      ry={(frame.height / 2 - strokeWidth / 2).toFixed(1)}
      {...svgProps}
    />
  );
};

export const DiamondShape = (props: {
  frame: Rect;
  svgProps: SvgProps;
}): string => {
  const { frame, svgProps } = props;
  const { x, y, width, height } = frame;
  const strokeWidth = svgProps.strokeWidth as number;
  return (
    <polygon
      points={
        `${(x + width / 2).toFixed(1)},${(y + (strokeWidth / 2) * 2 ** 0.5).toFixed(1)}` +
        ` ${(x + width - (strokeWidth / 2) * 2 ** 0.5).toFixed(1)},${(y + height / 2).toFixed(1)}` +
        ` ${(x + width / 2).toFixed(1)},${(y + height - (strokeWidth / 2) * 2 ** 0.5).toFixed(1)} ` +
        `${(x + (strokeWidth / 2) * 2 ** 0.5).toFixed(1)},${(y + height / 2).toFixed(1)}`
      }
      {...svgProps}
    />
  );
};

export const NodeShape = (props: { frame: Rect; astNode: AstNode }): string => {
  const { frame, astNode } = props;
  const commonProps = {
    fill: 'none',
    stroke: 'black',
    strokeWidth: astNode.borderWidth,
  };
  switch (astNode.props.shape ?? 'rect') {
    case 'rect': {
      const svgProps = commonProps as typeof commonProps & {
        rx?: string;
        ry?: string;
      };
      svgProps.rx = svgProps.ry = astNode.props.radius;
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

export const TextSpan = (props: { frame: Rect }): string => {
  return (
    <RectShape
      frame={props.frame}
      svgProps={{ fill: 'lightgray', stroke: 'none', strokeWidth: 0 }}
    />
  );
};
