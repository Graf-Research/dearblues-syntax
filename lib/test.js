"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var _1 = require(".");
try {
    var parser = new _1.DearbluesParser();
    var source_code = fs.readFileSync('./sample.dbs', 'utf8');
    parser.parse(source_code);
}
catch (e) {
    console.log(e.message);
}
