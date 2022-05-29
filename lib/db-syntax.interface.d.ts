export interface MooValue {
    type: string;
    value: string;
    text: string;
    offset: number;
    lineBreaks: number;
    line: number;
    col: number;
}
export interface ObjectGrammarTableOptionsDefaultValue {
    options?: MooValue[];
    default?: {
        type: 'string' | 'number' | 'boolean';
        value: MooValue;
    };
}
export interface ObjectGrammarTableItemPrimitive extends ObjectGrammarTableOptionsDefaultValue {
    type: 'primitive';
    column: MooValue;
    data_type: MooValue;
}
export interface ObjectGrammarTableItemEnum extends ObjectGrammarTableOptionsDefaultValue {
    type: 'enum';
    column: MooValue;
    enum: MooValue;
}
export interface ObjectGrammarTableItemReference extends ObjectGrammarTableOptionsDefaultValue {
    type: 'reference';
    column: MooValue;
    reference: {
        table: MooValue;
        column: MooValue;
    };
}
export declare type ObjectGrammarTableItem = ObjectGrammarTableItemPrimitive | ObjectGrammarTableItemEnum | ObjectGrammarTableItemReference;
export interface ObjectGrammarTable {
    type: 'table';
    name: MooValue;
    items: ObjectGrammarTableItem[];
}
export interface ObjectGrammarEnum {
    type: 'enum';
    name: MooValue;
    items: MooValue[];
}
export declare type ObjectGrammar = ObjectGrammarTable | ObjectGrammarEnum;
