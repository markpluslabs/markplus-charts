export interface AstProps {
  [key: string]: string;
}
export interface AstNode {
  id: string;
  vPadding: number;
  hPadding: number;
  props: AstProps;
}
export interface AstLink {
  id: string;
  from: string;
  to: string;
  props: AstProps;
}

class Ast {
  props: AstProps = {};
  nodes: AstNode[] = [];
  links: AstLink[] = [];

  private nodeMap: Map<string, AstNode>;
  private linkMap: Map<string, AstLink>;

  createIndex() {
    this.nodeMap = new Map(this.nodes.map((n) => [n.id, n]));
    this.linkMap = new Map(this.links.map((e) => [e.id, e]));
  }

  getNode(id: string) {
    return this.nodeMap.get(id);
  }

  getLink(id: string) {
    return this.linkMap.get(id);
  }

  get plainObject() {
    return {
      props: this.props,
      nodes: this.nodes,
      links: this.links,
    };
  }
}

export default Ast;
