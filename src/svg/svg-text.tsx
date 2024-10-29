import React from 'react';

import CONSTS from '../consts';
import { Rect } from './interfaces';

const SvgText = (props: { text: string; frame: Rect }) => {
  const { text, frame } = props;
  const lines = text.split('\n');
  const totalTextHeight = lines.length * CONSTS.LINE_HEIGHT;
  const centerY = frame.y + frame.height / 2;
  const startY = centerY - totalTextHeight / 2 + CONSTS.BASELINE_HEIGHT;
  const x = (frame.x + frame.width / 2).toFixed(1);
  return (
    <text
      x={x}
      fontFamily={CONSTS.FONT_FAMILY}
      fontSize={CONSTS.FONT_SIZE}
      textAnchor="middle"
    >
      {lines.map((line, index) => (
        <tspan
          key={index}
          x={x}
          y={(startY + index * CONSTS.LINE_HEIGHT).toFixed(1)}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
};

export default SvgText;