interface Node {
  id: string;
  label: string;
}
interface Edge {
  from: string;
  to: string;
  directional: boolean;
}

class Ast {
  nodes: Node[] = [];
  edges: Edge[] = [];
}

export default Ast;
