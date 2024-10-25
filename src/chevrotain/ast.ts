interface Node {
  id: string;
  label: string;
}
interface Edge {
  id: string;
  from: string;
  to: string;
  directional: boolean;
}

class Ast {
  nodes: Node[] = [];
  edges: Edge[] = [];

  private nodeMap: Map<string, Node>;
  private edgeMap: Map<string, Edge>;

  createIndex() {
    this.nodeMap = new Map(this.nodes.map((n) => [n.id, n]));
    this.edgeMap = new Map(this.edges.map((e) => [e.id, e]));
  }

  getNode(id: string) {
    return this.nodeMap.get(id);
  }

  getEdge(id: string) {
    return this.edgeMap.get(id);
  }
}

export default Ast;
