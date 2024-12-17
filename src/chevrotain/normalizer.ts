import Ast from './ast';

const normalizePadding = (paddingStr: string): [number, number] => {
  let [vPadding, hPadding] = (paddingStr ?? '16 32')
    .split(/\s+/)
    .map((i) => parseInt(i))
    .map((i) => (isNaN(i) ? 0 : i));
  vPadding = Math.max(vPadding ?? 0, 0);
  hPadding = hPadding ?? vPadding;
  hPadding = Math.max(hPadding, 0);
  return [vPadding, hPadding];
};

export const normalize = (ast: Ast): Ast => {
  ast.nodes.forEach((n) => {
    [n.vPadding, n.hPadding] = normalizePadding(
      n.props.padding ?? ast.props.nodePadding ?? '32',
    );
    n.borderWidth = parseInt(
      n.props.borderWidth ?? ast.props.borderWidth ?? '2',
    );
    n.props.shape = n.props.shape ?? ast.props.nodeShape ?? 'rect';
    n.props.rectRadius = n.props.rectRadius ?? ast.props.rectRadius ?? '0';
    n.props.bgColor = n.props.bgColor ?? ast.props.bgColor ?? 'none';
  });
  ast.links.forEach((l) => {
    l.props.style = l.props.style ?? ast.props.linkStyle ?? 'solid';
    l.props.arrowHeads = l.props.arrowHeads ?? ast.props.arrowHeads ?? 'end';
  });
  return ast;
};
