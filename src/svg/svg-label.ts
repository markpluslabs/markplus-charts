import CONSTS from '../consts';
import { Rect } from './interfaces';

class SvgLabel {
  text: string;
  frame: Rect;

  constructor(text: string, frame: Rect) {
    this.text = text;
    this.frame = frame;
  }

  toString(): string {
    let r = ``;
    const lines = this.text.split('\n');
    const totalTextHeight = lines.length * CONSTS.LINE_HEIGHT;
    const centerY = this.frame.y + this.frame.height / 2;
    const startY = centerY - totalTextHeight / 2 + CONSTS.BASELINE_HEIGHT;
    const x = (this.frame.x + this.frame.width / 2).toFixed(1);
    r += `<text x="${x}" font-family="${CONSTS.FONT_FAMILY}" font-size="${CONSTS.FONT_SIZE}" text-anchor="middle">`;
    lines.forEach((line, index) => {
      const lineY = (startY + index * CONSTS.LINE_HEIGHT).toFixed(1);
      r += `<tspan x="${x}" y="${lineY}">${line}</tspan>`;
    });
    r += `</text>`;
    return r;
  }
}

export default SvgLabel;
