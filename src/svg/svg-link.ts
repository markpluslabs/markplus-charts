import { AstProps } from '../chevrotain/ast';

class SvgLink {
  points: { x: number; y: number }[];
  astProps: AstProps;

  constructor(points: { x: number; y: number }[], astProps: AstProps) {
    this.points = points;
    this.astProps = astProps;
  }

  toString(): string {
    const path =
      'M' +
      this.points
        .map((p) => `L ${p.x} ${p.y}`)
        .join(' ')
        .substring(1);
    if (this.astProps.direction === 'none') {
      return `<path d="${path}" fill="none" stroke="black" />`;
    } else if (this.astProps.direction === 'both') {
      return `<path d="${path}" fill="none" stroke="black" marker-end="url(#arrowhead)" marker-start="url(#arrowhead)" />`;
    } else {
      return `<path d="${path}" fill="none" stroke="black" marker-end="url(#arrowhead)" />`;
    }
  }
}

export default SvgLink;
