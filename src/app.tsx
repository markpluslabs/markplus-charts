import { Divider, Input, Typography } from 'antd';
import React, { useEffect } from 'react';

import { generateAst } from './chevrotain';
import Ast from './chevrotain/ast';
import { layout } from './elk';
import Svg from './svg';

const { Title } = Typography;

const App = () => {
  const [code, setCode] = React.useState<string>(
    `
// global settings
direction: down
routingStyle: splines
spacing: 64
nodePadding: 32 16

A{label: Christmas; radius: 8; padding: 8}
B{label: Go shopping}
C{label: Let me\\nthink; shape: diamond}
// You will need to escape "//":
D{label: Laptop https:\\//example.com; shape: ellipse}
E{label: iPhone} // line end comment
F{
label: Car // comment
shape: circle
}
Z{label: stand alone}

A -> B
B ->{style: dashed} C
C ->{label: One; style: dotted} D
C ->{label: Two} E
C ->{label: Three} F
F ->{direction:both} A
`.trim(),
  );

  const [ast, setAst] = React.useState<Ast>(undefined);
  const [elkNode, setElkNode] = React.useState(undefined);

  useEffect(() => {
    const ast = generateAst(code);
    (async () => {
      const _elkNode = await layout(ast);
      setAst(ast);
      setElkNode(_elkNode);
    })();
  }, [code]);
  return (
    <>
      <Title>MarkPlus Charts Demo</Title>
      <Input.TextArea
        rows={16}
        style={{ maxWidth: 800 }}
        value={code}
        onChange={(e) => setCode(e.target.value.trim())}
      />
      <Divider />
      {ast && elkNode && <Svg ast={ast} elkNode={elkNode} />}
    </>
  );
};

export default App;
