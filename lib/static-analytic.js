"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performStaticChecks = void 0;
function getErrorString(moo, str) {
    return "Line ".concat(moo.line, " col: ").concat(moo.col, ": ").concat(str);
}
function count(item, arr) {
    return arr.reduce(function (acc, curr) { return acc + (curr === item ? 1 : 0); }, 0);
}
function performStaticChecks(list_object) {
    var _a;
    var list_table = list_object.filter(function (go) { return go.type === 'table'; });
    var list_enum = list_object.filter(function (go) { return go.type === 'enum'; });
    // check duplicate table/enum name
    var list_table_name = list_table.map(function (t) { return t.name.value; });
    var list_enum_name = list_enum.map(function (t) { return t.name.value; });
    for (var i = list_table.length - 1; i >= 0; i--) {
        var table = list_table[i];
        if (count(table.name.value, list_table_name) > 1) {
            throw new Error(getErrorString(table.name, "Table name \"".concat(table.name.value, "\" has been declared on another table")));
        }
        if (count(table.name.value, list_enum_name) > 0) {
            throw new Error(getErrorString(table.name, "Table name \"".concat(table.name.value, "\" has been declared on enum")));
        }
    }
    for (var i = list_enum.length - 1; i >= 0; i--) {
        var _enum = list_enum[i];
        if (count(_enum.name.value, list_enum_name) > 1) {
            throw new Error(getErrorString(_enum.name, "Enum name \"".concat(_enum.name.value, "\" has been declared on another enum")));
        }
        if (count(_enum.name.value, list_table_name) > 0) {
            throw new Error(getErrorString(_enum.name, "Enum name \"".concat(_enum.name.value, "\" has been declared on table")));
        }
    }
    // check duplicate column name
    for (var _i = 0, list_table_1 = list_table; _i < list_table_1.length; _i++) {
        var table = list_table_1[_i];
        var list_table_column_name = table.items.map(function (col) { return col.column.value; });
        for (var i = table.items.length - 1; i >= 0; i--) {
            var item = table.items[i];
            if (count(item.column.value, list_table_column_name) > 1) {
                throw new Error(getErrorString(item.column, "Column name \"".concat(item.column.value, "\" is duplicate")));
            }
        }
    }
    // check duplicate item enum
    for (var _b = 0, list_enum_1 = list_enum; _b < list_enum_1.length; _b++) {
        var _enum = list_enum_1[_b];
        var list_enum_item_name = _enum.items.map(function (item_enum) { return item_enum.value; });
        for (var i = _enum.items.length - 1; i >= 0; i--) {
            var item = _enum.items[i];
            if (count(item.value, list_enum_item_name) > 1) {
                throw new Error(getErrorString(item, "Item enum \"".concat(item.value, "\" is duplicate")));
            }
        }
    }
    // check enum on table
    var list_enum_label = list_enum.map(function (e) { return e.name.value; });
    for (var _c = 0, list_table_2 = list_table; _c < list_table_2.length; _c++) {
        var table = list_table_2[_c];
        var list_item_enum = table.items.filter(function (goti) { return goti.type === 'enum'; });
        for (var _d = 0, list_item_enum_1 = list_item_enum; _d < list_item_enum_1.length; _d++) {
            var item_type_enum = list_item_enum_1[_d];
            if (!list_enum_label.includes(item_type_enum.enum.value)) {
                throw new Error(getErrorString(item_type_enum.enum, "Type enum \"".concat(item_type_enum.enum, "\" is undefined on table \"").concat(table.name, "\" column \"").concat(item_type_enum.column, " ").concat(item_type_enum.enum, "\".")));
            }
        }
    }
    // check foreign key
    for (var _e = 0, list_table_3 = list_table; _e < list_table_3.length; _e++) {
        var table = list_table_3[_e];
        var list_item_fk = table.items.filter(function (goti) { return goti.type === 'reference'; });
        var _loop_1 = function (item_type_fk) {
            var fk_table = list_table.find(function (t) { return t.name.value === item_type_fk.reference.table.value; });
            if (!fk_table) {
                throw new Error(getErrorString(item_type_fk.reference.table, "Table \"".concat(item_type_fk.reference.table, "\" is undefined on table \"").concat(table.name, "\" column \"").concat(item_type_fk.column, " ").concat(item_type_fk.reference.table, ".").concat(item_type_fk.reference.column, "\"")));
            }
            var pk_column = fk_table.items.find(function (c) { return c.type === 'primitive' && c.column.value === item_type_fk.reference.column.value; });
            if (!pk_column) {
                throw new Error(getErrorString(item_type_fk.reference.column, "Column \"".concat(item_type_fk.reference.table, ".").concat(item_type_fk.reference.column, "\" is not defined on table \"").concat(item_type_fk.reference.table, "\"")));
            }
            if (!((_a = pk_column.options) !== null && _a !== void 0 ? _a : []).map(function (moo) { return moo.value; }).includes('pk')) {
                throw new Error(getErrorString(item_type_fk.reference.column, "Column \"".concat(item_type_fk.reference.table, ".").concat(item_type_fk.reference.column, "\" should be a primary key on table \"").concat(item_type_fk.reference.table, "\"")));
            }
        };
        for (var _f = 0, list_item_fk_1 = list_item_fk; _f < list_item_fk_1.length; _f++) {
            var item_type_fk = list_item_fk_1[_f];
            _loop_1(item_type_fk);
        }
    }
}
exports.performStaticChecks = performStaticChecks;
