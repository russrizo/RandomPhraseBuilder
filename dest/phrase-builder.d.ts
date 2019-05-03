declare type StringFunction<T> = () => T;
declare type Param = string | number | boolean;
export interface IParams {
    [key: string]: Param | StringFunction<string>;
}
export interface IValue {
    [key: string]: string[];
}
export interface IValues {
    [key: string]: IValue;
}
export interface ISentence {
    description?: string;
    variations: string[];
    values?: IValues;
}
export interface ISentenceBundle {
    [key: string]: ISentence;
}
export declare class PhraseBuilder {
    readonly defaultValueKey: string;
    readonly emptyValue: string;
    readonly locale: string;
    private pluralRules;
    readonly sentenceBundle: ISentenceBundle | undefined;
    constructor(options?: {
        sentenceBundle?: ISentenceBundle;
        defaultValueKey?: string;
        emptyValue?: string;
        locale?: string;
        icu?: boolean;
    });
    hasICULocaleSupport(januaryString: string): boolean;
    getText(node: ISentence | string, params?: IParams): string;
    private getRandomVariation;
    private getParamValue;
    private exists;
    private getPhrase;
    private getValueTemplate;
}
export {};
