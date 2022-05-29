import * as fs from 'fs';
import { DearbluesParser } from ".";

try {
  const parser = new DearbluesParser();
  const source_code = fs.readFileSync('./sample.dbs', 'utf8');
  parser.parse(source_code);
} catch (e: any) {
  console.log(e.message);
}
