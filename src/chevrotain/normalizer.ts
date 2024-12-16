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
      n.props.padding ?? ast.props.nodePadding ?? '16 32',
    );
  });
  ast.links.forEach((l) => {
    l.props.style = l.props.style ?? ast.props.linkStyle ?? 'solid';
  });
  return ast;
};
