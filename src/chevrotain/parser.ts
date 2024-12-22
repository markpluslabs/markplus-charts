import { CstParser } from "chevrotain";

import {
  Link,
  multiModeLexerDefinition,
  Node,
  Node0,
  PropKey,
  PropValue,
} from "./lexer.js";

class Parser extends CstParser {
  constructor() {
    super(multiModeLexerDefinition);
    this.performSelfAnalysis();
  }

  parse = this.RULE("parse", () => {
    this.OPTION(() => {
      this.SUBRULE(this.properties, { LABEL: "globalProps" });
    });
    this.MANY(() => {
      this.SUBRULE1(this.statement, { LABEL: "statements" });
    });
  });

  statement = this.RULE("statement", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(Node0, { LABEL: "fromNode" });
        },
      },
      {
        ALT: () => {
          this.CONSUME1(Node, { LABEL: "fromNode" });
        },
      },
    ]);
    this.OPTION(() => {
      this.SUBRULE(this.properties, { LABEL: "fromNodeProps" });
    });
    this.OPTION1(() => {
      this.CONSUME2(Link, { LABEL: "link" });
      this.OPTION2(() => {
        this.SUBRULE1(this.properties, { LABEL: "linkProps" });
      });
      this.CONSUME3(Node, { LABEL: "toNode" });
      this.OPTION3(() => {
        this.SUBRULE2(this.properties, { LABEL: "toNodeProps" });
      });
    });
  });

  properties = this.RULE("properties", () => {
    this.MANY(() => {
      this.SUBRULE(this.property, { LABEL: "properties" });
    });
  });

  property = this.RULE("property", () => {
    this.CONSUME(PropKey, { LABEL: "propKey" });
    this.CONSUME1(PropValue, { LABEL: "propValue" });
  });
}

const parser = new Parser();
export default parser;
