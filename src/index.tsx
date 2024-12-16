/** @jsx jsx */
import { jsx, options } from 'jsx2str';

import { generateAst, normalizeAst } from './chevrotain';
import { layout } from './elk';
import Svg from './svg';

export const generate = async (
  input: string,
  debug = false,
): Promise<string> => {
  const ast = normalizeAst(generateAst(input));
  const elkNode = await layout(ast, debug);
  const oldVal = options.formatOutput;
  options.formatOutput = debug;
  const svgStr = (<Svg ast={ast} elkNode={elkNode} />) as string;
  options.formatOutput = oldVal;
  return svgStr;
};
