import * as nearley from "nearley";
import { ObjectGrammar } from "./db-syntax.interface";
import { performStaticChecks } from "./static-analytic";

export class DearbluesParser {
  private grammar = require("../grammar/compiled/db-syntax");
  private parser = new nearley.Parser(nearley.Grammar.fromCompiled(this.grammar));

  constructor() {
    //
  }

  public parse(code: string): ObjectGrammar[] {
    try {
      this.parser.feed(code.trim());

      const res: ObjectGrammar[] = this.parser.results[0];
      performStaticChecks(res);
      const total = {
        table: res.reduce((acc, curr) => acc + (curr.type === 'table' ? 1 : 0), 0),
        enum: res.reduce((acc, curr) => acc + (curr.type === 'enum' ? 1 : 0), 0),
      };
      console.log(`Stats: table = ${total.table}, enum = ${total.enum}`);
      console.log(`Ambiguity: ${this.parser.results.length}`);
      return res;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
