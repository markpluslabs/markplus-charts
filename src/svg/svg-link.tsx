import React from 'react';

import { AstLink } from '../chevrotain/ast';
import { Point } from './interfaces';

const SvgLink = (props: { points: Point[]; astLink: AstLink }) => {
  const { points, astLink } = props;
  let strokeDasharray: string | undefined = undefined;
  if (astLink.props.style === 'dotted') {
    strokeDasharray = '1 3';
  } else if (astLink.props.style === 'dashed') {
    strokeDasharray = '4 4';
  }
  return (
    <path
      strokeDasharray={strokeDasharray}
      d={`M${points
        .map((p) => `L ${p.x} ${p.y}`)
        .join(' ')
        .substring(1)}`}
      fill="none"
      stroke="black"
      markerEnd={
        astLink.props.direction !== 'none' ? 'url(#arrowhead)' : undefined
      }
      markerStart={
        astLink.props.direction === 'both' ? 'url(#arrowhead)' : undefined
      }
    />
  );
};

export default SvgLink;
