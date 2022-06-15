"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DearbluesParser = void 0;
var nearley = require("nearley");
var static_analytic_1 = require("./static-analytic");
var DearbluesParser = /** @class */ (function () {
    function DearbluesParser() {
        this.grammar = require("../grammar/compiled/db-syntax");
        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(this.grammar));
        //
    }
    DearbluesParser.prototype.parse = function (code) {
        try {
            if (!code.trim()) {
                return [];
            }
            this.parser.feed(code.trim());
            var res = this.parser.results[0];
            if (!res) {
                throw new Error("Syntax error at line ".concat(code.split('\n').length));
            }
            (0, static_analytic_1.performStaticChecks)(res);
            var total = {
                table: res.reduce(function (acc, curr) { return acc + (curr.type === 'table' ? 1 : 0); }, 0),
                enum: res.reduce(function (acc, curr) { return acc + (curr.type === 'enum' ? 1 : 0); }, 0),
            };
            console.log("Stats: table = ".concat(total.table, ", enum = ").concat(total.enum));
            console.log("Ambiguity: ".concat(this.parser.results.length));
            return res;
        }
        catch (e) {
            throw new Error(e.message);
        }
    };
    return DearbluesParser;
}());
exports.DearbluesParser = DearbluesParser;
