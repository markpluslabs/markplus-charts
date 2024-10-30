export const normalizePadding = (paddingStr: string): [number, number] => {
  let [vPadding, hPadding] = (paddingStr ?? '16 32')
    .split(/\s+/)
    .map((i) => parseInt(i))
    .map((i) => (isNaN(i) ? 0 : i));
  vPadding = Math.max(vPadding ?? 0, 0);
  hPadding = hPadding ?? vPadding;
  hPadding = Math.max(hPadding, 0);
  return [vPadding, hPadding];
};
