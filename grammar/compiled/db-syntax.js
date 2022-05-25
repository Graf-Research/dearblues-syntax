// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const keywords_data_type = [
  'uuid',
  'integer',
  'bigint',
  'varchar',
  'float',
  'timestamp',
  'timestamptz',
  'date',
  'datetime',
  'text',
  'boolean'
];

const keywords_table = [
  'table', 'Table'
];

const keywords_enum = [
  'enum', 'Enum'
];

const keywords_default = [
  'default', 'Default'
];

const keywords_boolean = [
  'true', 'false'
];

const keywords_options = [
  'pk', 'primarykey', 'index', 'nullable'
];

const lexer = moo.compile({
  ws: /[ \t]+/,
  nl: { match: /\n+/, lineBreaks: true },
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  number: /[0-9]+/,
  comma: /\,/,
  dot: /\./,
  variable: {
    match: /[a-zA-Z_][a-zA-Z0-9_]*/, 
    type: moo.keywords({
      keywords_data_type,
      keywords_table,
      keywords_enum,
      keywords_default,
      keywords_options,
      keywords_boolean
    })
  },
  item_begin: /[\-]/,
  equals: /[\=]/
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "___MAIN___", "symbols": ["___MAIN___", (lexer.has("nl") ? {type: "nl"} : nl), "table"], "postprocess": d => [...d[0], d[2]]},
    {"name": "___MAIN___", "symbols": ["___MAIN___", (lexer.has("nl") ? {type: "nl"} : nl), "enum"], "postprocess": d => [...d[0], d[2]]},
    {"name": "___MAIN___", "symbols": ["table"]},
    {"name": "___MAIN___", "symbols": ["enum"]},
    {"name": "enum", "symbols": ["enum_header", (lexer.has("nl") ? {type: "nl"} : nl), "enum_items"], "postprocess":  d => ({
          type: 'enum',
          name: d[0],
          items: d[2]
        }) },
    {"name": "enum_header", "symbols": [(lexer.has("keywords_enum") ? {type: "keywords_enum"} : keywords_enum), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": d => d[2]},
    {"name": "enum_items", "symbols": ["enum_items", (lexer.has("nl") ? {type: "nl"} : nl), "enum_item"], "postprocess": d => [...d[0], d[2]]},
    {"name": "enum_items", "symbols": ["enum_item"]},
    {"name": "enum_item", "symbols": [(lexer.has("item_begin") ? {type: "item_begin"} : item_begin), "_ws_", (lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": d => d[2]},
    {"name": "table", "symbols": ["table_header", (lexer.has("nl") ? {type: "nl"} : nl), "table_items"], "postprocess":  d => ({
          type: 'table',
          name: d[0],
          items: d[2]
        }) },
    {"name": "table_header", "symbols": [(lexer.has("keywords_table") ? {type: "keywords_table"} : keywords_table), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": d => d[2]},
    {"name": "table_items", "symbols": ["table_items", (lexer.has("nl") ? {type: "nl"} : nl), "table_item"], "postprocess": d => [...d[0], d[2]]},
    {"name": "table_items", "symbols": ["table_item"]},
    {"name": "table_item", "symbols": ["table_item_clean"], "postprocess": id},
    {"name": "table_item", "symbols": ["table_item_with_dv"], "postprocess": id},
    {"name": "table_item", "symbols": ["table_item_with_options"], "postprocess": id},
    {"name": "table_item", "symbols": ["table_item_with_options_dv"], "postprocess": id},
    {"name": "table_item_with_options_dv", "symbols": ["table_item_clean", (lexer.has("ws") ? {type: "ws"} : ws), "table_options", (lexer.has("ws") ? {type: "ws"} : ws), "table_dv"], "postprocess":  d => ({
          ...d[0],
          options: d[2],
          default: d[4]
        }) },
    {"name": "table_item_with_dv", "symbols": ["table_item_clean", (lexer.has("ws") ? {type: "ws"} : ws), "table_dv"], "postprocess":  d => ({
          ...d[0],
          default: d[2]
        }) },
    {"name": "table_item_with_options", "symbols": ["table_item_clean", (lexer.has("ws") ? {type: "ws"} : ws), "table_options"], "postprocess":  d => ({
          ...d[0],
          options: d[2]
        }) },
    {"name": "table_item_clean", "symbols": ["table_item_reference"], "postprocess": id},
    {"name": "table_item_clean", "symbols": ["table_item_enum"], "postprocess": id},
    {"name": "table_item_clean", "symbols": ["table_item_primitive"], "postprocess": id},
    {"name": "table_item_reference", "symbols": [(lexer.has("item_begin") ? {type: "item_begin"} : item_begin), "_ws_", (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("ws") ? {type: "ws"} : ws), "fk_access"], "postprocess":  d => ({
          type: 'reference',
          column: d[2],
          reference: d[4]
        }) },
    {"name": "table_item_enum", "symbols": [(lexer.has("item_begin") ? {type: "item_begin"} : item_begin), "_ws_", (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("variable") ? {type: "variable"} : variable)], "postprocess":  d => ({
          type: 'enum',
          column: d[2],
          enum: d[4]
        }) },
    {"name": "table_item_primitive", "symbols": [(lexer.has("item_begin") ? {type: "item_begin"} : item_begin), "_ws_", (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("keywords_data_type") ? {type: "keywords_data_type"} : keywords_data_type)], "postprocess":  d => ({
          type: 'primitive',
          column: d[2],
          data_type: d[4]
        }) },
    {"name": "fk_access", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("dot") ? {type: "dot"} : dot), (lexer.has("variable") ? {type: "variable"} : variable)], "postprocess":  d => ({
          table: d[0],
          column: d[2]
        }) },
    {"name": "table_options", "symbols": ["table_options", "_ws_", (lexer.has("comma") ? {type: "comma"} : comma), "_ws_", (lexer.has("keywords_options") ? {type: "keywords_options"} : keywords_options)], "postprocess": d => [...d[0], d[4]]},
    {"name": "table_options", "symbols": [(lexer.has("keywords_options") ? {type: "keywords_options"} : keywords_options)]},
    {"name": "table_dv", "symbols": [(lexer.has("keywords_default") ? {type: "keywords_default"} : keywords_default), "_ws_", (lexer.has("equals") ? {type: "equals"} : equals), "_ws_", "table_dv_value"], "postprocess": d => d[4]},
    {"name": "table_dv_value", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess":  d => ({
          type: 'string',
          value: d[0]
        }) },
    {"name": "table_dv_value", "symbols": [(lexer.has("keywords_boolean") ? {type: "keywords_boolean"} : keywords_boolean)], "postprocess":  d => ({
          type: 'boolean',
          value: d[0]
        }) },
    {"name": "table_dv_value", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess":  d => ({
          type: 'number',
          value: d[0]
        }) },
    {"name": "_ws_$ebnf$1", "symbols": []},
    {"name": "_ws_$ebnf$1", "symbols": ["_ws_$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ws_", "symbols": ["_ws_$ebnf$1"]}
]
  , ParserStart: "___MAIN___"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
