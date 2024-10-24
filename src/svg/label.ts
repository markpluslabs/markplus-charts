import CONSTS from '../consts';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

class Label {
  public text: string;
  public frame: Rect;

  public constructor(text: string, frame: Rect) {
    this.text = text;
    this.frame = frame;
  }

  public toSvg(): string {
    let r = ``;
    const lines = this.text.split('\n');
    const totalTextHeight = lines.length * CONSTS.LINE_HEIGHT;
    const centerY = this.frame.y + this.frame.height / 2;
    const startY = centerY - totalTextHeight / 2 + CONSTS.BASELINE_HEIGHT;
    r += `<text x="${this.frame.x + this.frame.width / 2}" font-family="${CONSTS.FONT_FAMILY}" font-size="${CONSTS.FONT_SIZE}" text-anchor="middle">`;
    lines.forEach((line, index) => {
      const lineY = startY + index * CONSTS.LINE_HEIGHT;
      r += `<tspan x="${this.frame.x + this.frame.width / 2}" y="${lineY}">${line}</tspan>`;
    });
    r += `</text>`;
    return r;
  }
}

export default Label;
