@{%
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
%}

@lexer lexer
