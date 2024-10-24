import { Rect, SvgProps } from './interfaces';

class SvgNode {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public svgProps: SvgProps;

  public constructor(frame: Rect, svgProps: SvgProps) {
    this.x = frame.x;
    this.y = frame.y;
    this.width = frame.width;
    this.height = frame.height;
    this.svgProps = svgProps;
  }

  public toSvg(): string {
    return `<rect x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" fill="${this.svgProps.fill}" stroke="${this.svgProps.stroke}" stroke-width="${this.svgProps.strokeWidth}" />`;
  }
}

export default SvgNode;
