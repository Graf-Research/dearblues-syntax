import { ObjectGrammar } from "./db-syntax.interface";
export declare class DearbluesParser {
    private grammar;
    private parser;
    constructor();
    parse(code: string): ObjectGrammar[];
}
