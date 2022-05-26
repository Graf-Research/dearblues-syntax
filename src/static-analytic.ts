import { MooValue, ObjectGrammar, ObjectGrammarEnum, ObjectGrammarTable, ObjectGrammarTableItem, ObjectGrammarTableItemEnum, ObjectGrammarTableItemReference } from "./db-syntax.interface";

function getErrorString(moo: MooValue, str: string): string {
  return `Line ${moo.line} col: ${moo.col}: ${str}`;
}

function count(item: any, arr: any[]): number {
  return arr.reduce((acc: number, curr: any) => acc + (curr === item ? 1 : 0), 0);
}

export function performStaticChecks(list_object: ObjectGrammar[]) {
  const list_table: ObjectGrammarTable[] = list_object.filter(go => go.type === 'table') as ObjectGrammarTable[];
  const list_enum: ObjectGrammarEnum[] = list_object.filter(go => go.type === 'enum') as ObjectGrammarEnum[];

  // check duplicate table/enum name
  const list_table_name: string[] = list_table.map((t: ObjectGrammarTable) => t.name.value);
  const list_enum_name: string[] = list_enum.map((t: ObjectGrammarEnum) => t.name.value);
  for (let i = list_table.length - 1; i >= 0; i--) {
    const table = list_table[i];
    if (count(table.name.value, list_table_name) > 1) {
      throw new Error(getErrorString(table.name, `Table name "${table.name.value}" has been declared on another table`));
    }
    if (count(table.name.value, list_enum_name) > 0) {
      throw new Error(getErrorString(table.name, `Table name "${table.name.value}" has been declared on enum`));
    }
  }
  for (let i = list_enum.length - 1; i >= 0; i--) {
    const _enum = list_enum[i];
    if (count(_enum.name.value, list_enum_name) > 1) {
      throw new Error(getErrorString(_enum.name, `Enum name "${_enum.name.value}" has been declared on another enum`));
    }
    if (count(_enum.name.value, list_table_name) > 0) {
      throw new Error(getErrorString(_enum.name, `Enum name "${_enum.name.value}" has been declared on table`));
    }
  }

  // check duplicate column name
  for (const table of list_table) {
    const list_table_column_name = table.items.map((col: ObjectGrammarTableItem) => col.column.value);
    for (let i = table.items.length - 1; i >= 0; i--) {
      const item = table.items[i];
      if (count(item.column.value, list_table_column_name) > 1) {
        throw new Error(getErrorString(item.column, `Column name "${item.column.value}" is duplicate`));
      }
    }
  }
  // check duplicate item enum
  for (const _enum of list_enum) {
    const list_enum_item_name = _enum.items.map((item_enum: MooValue) => item_enum.value);
    for (let i = _enum.items.length - 1; i >= 0; i--) {
      const item = _enum.items[i];
      if (count(item.value, list_enum_item_name) > 1) {
        throw new Error(getErrorString(item, `Item enum "${item.value}" is duplicate`));
      }
    }
  }
  
  // check enum on table
  const list_enum_label: string[] = list_enum.map(e => e.name.value);
  for (const table of list_table) {
    const list_item_enum: ObjectGrammarTableItemEnum[] = table.items.filter(goti => goti.type === 'enum') as ObjectGrammarTableItemEnum[];
    for (const item_type_enum of list_item_enum) {
      if (!list_enum_label.includes(item_type_enum.enum.value)) {
        throw new Error(getErrorString(item_type_enum.enum, `Type enum "${item_type_enum.enum}" is undefined on table "${table.name}" column "${item_type_enum.column} ${item_type_enum.enum}".`));
      }
    }
  }

  // check foreign key
  for (const table of list_table) {
    const list_item_fk: ObjectGrammarTableItemReference[] = table.items.filter(goti => goti.type === 'reference') as ObjectGrammarTableItemReference[];
    for (const item_type_fk of list_item_fk) {
      const fk_table : ObjectGrammarTable= list_table.find(t => t.name.value === item_type_fk.reference.table.value)!;
      if (!fk_table) {
        throw new Error(getErrorString(item_type_fk.reference.table, `Table "${item_type_fk.reference.table}" is undefined on table "${table.name}" column "${item_type_fk.column} ${item_type_fk.reference.table}.${item_type_fk.reference.column}"`));
      }

      const pk_column: ObjectGrammarTableItem = fk_table.items.find(c => c.type === 'primitive' && c.column.value === item_type_fk.reference.column.value)!;
      if (!pk_column) {
        throw new Error(getErrorString(item_type_fk.reference.column, `Column "${item_type_fk.reference.table}.${item_type_fk.reference.column}" is not defined on table "${item_type_fk.reference.table}"`));
      }
      
      if (!(pk_column.options ?? []).map(moo => moo.value).includes('pk')) {
        throw new Error(getErrorString(item_type_fk.reference.column, `Column "${item_type_fk.reference.table}.${item_type_fk.reference.column}" should be a primary key on table "${item_type_fk.reference.table}"`));
      }
    }
  }
}
