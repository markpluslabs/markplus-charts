import { CstParser } from 'chevrotain';

import { allTokens, Identifier, Link } from './lexer';

class ElkParser extends CstParser {
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
    this.CONSUME2(Identifier, { LABEL: 'to' });
  });
}

const parser = new ElkParser();

export default parser;
