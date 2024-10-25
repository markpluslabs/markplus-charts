import { Rect, SvgProps } from './interfaces';

class SvgNode {
  x: number;
  y: number;
  width: number;
  height: number;
  svgProps: SvgProps;

  constructor(frame: Rect, svgProps: SvgProps) {
    this.x = frame.x;
    this.y = frame.y;
    this.width = frame.width;
    this.height = frame.height;
    this.svgProps = svgProps;
  }

  toString(): string {
    return `<rect x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" fill="${this.svgProps.fill}" stroke="${this.svgProps.stroke}" stroke-width="${this.svgProps.strokeWidth}" />`;
  }
}

export default SvgNode;
