import prettier from 'prettier';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { generateAst } from './chevrotain';
import { layout } from './elk';
import Svg from './svg';

export const generate = async (
  input: string,
  debug = false,
): Promise<string> => {
  const ast = generateAst(input);

  const elkNode = await layout(ast, debug);

  let svgStr = renderToString(<Svg ast={ast} elkNode={elkNode} />);
  if (debug) {
    svgStr = await prettier.format(svgStr, { parser: 'html' });
  }
  return svgStr;
};
