/** @jsx jsx */
import { jsx, options } from "jsx2str";

import { generateAst, normalizeAst } from "./chevrotain/index.js";
import { layout } from "./elk/index.js";
import Svg from "./svg/index.js";

export const generate = async (
  input: string,
  debug = false,
): Promise<string> => {
  const ast = normalizeAst(generateAst(input));
  const elkNode = await layout(ast, debug);
  const oldVal = options.formatOutput;
  options.formatOutput = debug;
  const svgStr = <Svg ast={ast} elkNode={elkNode} /> as string;
  options.formatOutput = oldVal;
  return svgStr;
};
