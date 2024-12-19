/** @jsx jsx */
import { jsx } from 'jsx2str';

import { AstLink } from '../chevrotain/ast.js';
import { Point } from './interfaces.js';

const SvgLink = (props: { points: Point[]; astLink: AstLink }): string => {
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
      stroke={astLink.props.fgColor}
      markerEnd={
        astLink.props.arrowHeads !== 'none' ? 'url(#arrowhead)' : undefined
      }
      markerStart={
        astLink.props.arrowHeads === 'both' ? 'url(#arrowhead)' : undefined
      }
    />
  );
};

export default SvgLink;
