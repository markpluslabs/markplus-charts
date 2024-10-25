import { CstParser } from 'chevrotain';

import { allTokens, Identifier, Label, Link } from './lexer';

class Parser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  parse = this.RULE('parse', () => {
    this.MANY(() => {
      this.SUBRULE(this.statement, { LABEL: 'statements' });
    });
  });

  statement = this.RULE('statement', () => {
    this.CONSUME(Identifier, { LABEL: 'from' });
    this.CONSUME(Link, { LABEL: 'link' });
    this.OPTION(() => {
      this.CONSUME(Label, { LABEL: 'label' });
    });
    this.CONSUME2(Identifier, { LABEL: 'to' });
  });
}

const parser = new Parser();
export default parser;
