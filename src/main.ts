import nearley from "nearley";
import fs from 'fs';
import { ObjectGrammar } from "./db-syntax.interface";
import { performStaticChecks } from "./static-analytic";

const grammar = require("../grammar/compiled/db-syntax");
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

try {
  const source_code = fs.readFileSync('./sample.dbs', 'utf8');
  parser.feed(source_code.trim());

  const res: ObjectGrammar[] = parser.results[0];
  performStaticChecks(res);
  const total = {
    table: res.reduce((acc, curr) => acc + (curr.type === 'table' ? 1 : 0), 0),
    enum: res.reduce((acc, curr) => acc + (curr.type === 'enum' ? 1 : 0), 0),
  };
  console.log(`Stats: table = ${total.table}, enum = ${total.enum}`);
  console.log(`Ambiguity: ${parser.results.length}`);
} catch (e: any) {
  console.log(e.message);
}
