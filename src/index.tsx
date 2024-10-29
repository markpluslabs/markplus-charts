import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { generateAst } from './chevrotain';
import { layout } from './elk';
import Svg from './svg';

export const generate = async (input: string): Promise<string> => {
  const ast = generateAst(input);

  const elkNode = await layout(ast, {
    debug: false,
    direction: 'DOWN',
    node: { hPadding: 24, vPadding: 16 },
  });

  const svgStr = ReactDOMServer.renderToString(
    <Svg ast={ast} elkNode={elkNode} />,
  );
  return svgStr;
};
