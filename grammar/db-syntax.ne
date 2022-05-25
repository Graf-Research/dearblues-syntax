@include "./lexer.ne"

___MAIN___ -> ___MAIN___ %nl table {% d => [...d[0], d[2]] %}
  | ___MAIN___ %nl enum {% d => [...d[0], d[2]] %}
  | table
  | enum

# Enum
enum -> enum_header %nl enum_items {% d => ({
  type: 'enum',
  name: d[0],
  items: d[2]
}) %}
enum_header -> %keywords_enum %ws %variable {% d => d[2] %}
enum_items -> enum_items %nl enum_item {% d => [...d[0], d[2]] %}
  | enum_item

# Enum item
enum_item -> %item_begin _ws_ %variable {% d => d[2] %}

# Table
table -> table_header %nl table_items {% d => ({
  type: 'table',
  name: d[0],
  items: d[2]
}) %}
table_header -> %keywords_table %ws %variable {% d => d[2] %}
table_items -> table_items %nl table_item {% d => [...d[0], d[2]] %}
  | table_item

# Table item
table_item -> table_item_clean {% id %}
  | table_item_with_dv {% id %}
  | table_item_with_options {% id %}
  | table_item_with_options_dv {% id %}

# Possibile type of table item within "default value" and "options"
table_item_with_options_dv -> table_item_clean %ws table_options %ws table_dv {% d => ({
  ...d[0],
  options: d[2],
  default: d[4]
}) %}
table_item_with_dv -> table_item_clean %ws table_dv {% d => ({
  ...d[0],
  default: d[2]
}) %}
table_item_with_options -> table_item_clean %ws table_options {% d => ({
  ...d[0],
  options: d[2]
}) %}
table_item_clean -> table_item_reference {% id %}
  | table_item_enum {% id %}
  | table_item_primitive {% id %}

# Possible type of table item
table_item_reference -> %item_begin _ws_ %variable %ws fk_access {% d => ({
  type: 'reference',
  column: d[2],
  reference: d[4]
}) %}
table_item_enum -> %item_begin _ws_ %variable %ws %variable {% d => ({
  type: 'enum',
  column: d[2],
  enum: d[4]
}) %}
table_item_primitive -> %item_begin _ws_ %variable %ws %keywords_data_type {% d => ({
  type: 'primitive',
  column: d[2],
  data_type: d[4]
}) %}

# Table foreign key access
fk_access -> %variable %dot %variable {% d => ({
  table: d[0],
  column: d[2]
}) %}

# Table options
table_options -> table_options _ws_ %comma _ws_ %keywords_options {% d => [...d[0], d[4]] %}
  | %keywords_options

# Table default value
table_dv -> %keywords_default _ws_ %equals _ws_ table_dv_value {% d => d[4] %}
table_dv_value -> %string {% d => ({
  type: 'string',
  value: d[0]
}) %}
  | %keywords_boolean {% d => ({
  type: 'boolean',
  value: d[0]
}) %}
  | %number {% d => ({
  type: 'number',
  value: d[0]
}) %}

# optional spaces
_ws_ -> " ":*
