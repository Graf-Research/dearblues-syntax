import nearley from "nearley";
import fs from 'fs';
import { ObjectGrammar } from "./db-syntax.interface";

const grammar = require("../grammar/compiled/db-syntax");
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

try {
  const source_code = fs.readFileSync('./sample.dbs', 'utf8');
  parser.feed(source_code.trim());

  const res: ObjectGrammar[] = parser.results[0];
  console.log(JSON.stringify(res, null, 2));
  console.log(`Ambiguity: ${parser.results.length}`);
} catch (e: any) {
  console.log(`error`, e.message, "end");
}
