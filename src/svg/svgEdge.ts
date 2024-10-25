class SvgEdge {
  public points: { x: number; y: number }[];
  public directional: boolean;

  public constructor(points: { x: number; y: number }[], directional: boolean) {
    this.points = points;
    this.directional = directional;
  }

  public toSvg(): string {
    const path =
      'M' +
      this.points
        .map((p) => `L ${p.x} ${p.y}`)
        .join(' ')
        .substring(1);
    if (!this.directional) {
      return `<path d="${path}" fill="none" stroke="black" />`;
    }
    return `<path d="${path}" fill="none" stroke="black" marker-end="url(#arrowhead)" />`;
  }
}

export default SvgEdge;
