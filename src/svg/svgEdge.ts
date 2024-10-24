class SvgEdge {
  public points: { x: number; y: number }[];

  public constructor(points: { x: number; y: number }[]) {
    this.points = points;
  }

  public toSvg(): string {
    const path =
      'M' +
      this.points
        .map((p) => `L ${p.x} ${p.y}`)
        .join(' ')
        .substring(1);
    return `<path d="${path}" fill="none" stroke="black" marker-end="url(#arrowhead)" />`;
  }
}

export default SvgEdge;
