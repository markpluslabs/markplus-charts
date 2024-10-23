import { CstParser } from 'chevrotain';

import { allTokens, Arrow, Identifier } from './lexer';

class ElkParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  elkchart = this.RULE('elkchart', () => {
    this.MANY(() => {
      this.SUBRULE(this.connection);
    });
  });

  connection = this.RULE('connection', () => {
    this.CONSUME(Identifier, { LABEL: 'from' });
    this.CONSUME(Arrow);
    this.CONSUME2(Identifier, { LABEL: 'to' });
  });
}

const parser = new ElkParser();

export default parser;
