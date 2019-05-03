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

/**
 * Phrase Builder
 * options - phrase builder options
 * (string) [emptyValue = ''] - value to replace template if parameter is undefined/null
 * (string) [defaultValueKey = ''] - fallback key name for value template
 * (string) [locale = 'en-US'] - used for detecting number pluralization
 */
export class PhraseBuilder {
  readonly defaultValueKey: string = 'default';
  readonly emptyValue: string = '';
  readonly locale: string = 'en-US';
  private pluralRules: any;
  readonly sentenceBundle: ISentenceBundle | undefined = undefined;
  constructor(options: {
    sentenceBundle?: ISentenceBundle,
    defaultValueKey?: string,
    emptyValue?: string,
    locale?: string,
    icu?: boolean
  } = { icu: false }) {
    if (options.defaultValueKey) {
      this.defaultValueKey = options.defaultValueKey;
    }
    if (options.emptyValue) {
      this.emptyValue = options.emptyValue;
    }
    if (options.locale) {
      this.locale = options.locale;
    }
    if (options.locale) {
      this.locale = options.locale;
    }
    if (options.sentenceBundle) {
      this.sentenceBundle = options.sentenceBundle;
    }
    if (options.icu) {
      this.pluralRules = new Intl.PluralRules(this.locale);
    } else {
      this.pluralRules = { select: (value: number) => {
        return value.toString();
        }
      }
    }
  }
  public hasICULocaleSupport(januaryString: string) {
    try {
      const january = new Date(9e8);
      const month = new Intl.DateTimeFormat(this.locale, { month: 'long' });
      return month.format(january) === januaryString;
    } catch (err) {
      return false;
    }
  }

  public getText(node: ISentence | string, params: IParams = {}): string {
    let sentence: ISentence;
    if (typeof node === 'string' && this.sentenceBundle) {
      sentence = this.sentenceBundle[node];
    } else {
      sentence = node as ISentence;
    }
    let variation = this.getRandomVariation(sentence.variations);
    if (variation === undefined) {
      return '';
    }
    let match = /{([\w-_]+)}/g.exec(variation);
    while (match && match.length > 1) {
      const [, key] = match;
      const parameter = this.getParamValue(key, params);
      let phrase = '';
      const valueTemplate = this.getValueTemplate(sentence, key);
      if (valueTemplate) {
        phrase = this.getPhrase(valueTemplate, key, parameter);
      } else {
        phrase = String(parameter) || this.emptyValue;
      }
      variation = variation.replace(`{${key}}`, phrase);
      match = /{([\w-_]+)}/g.exec(variation);
    }
    return variation;
  }

  private getRandomVariation(options: string[]): string {
    if (options.  length > 1) {
      return options[Math.floor(Math.random() * options.length)];
    }
    return options[0];
  }

  private getParamValue(key: string, params: IParams): Param | undefined {
    const { [key]: value } = params;
    if (value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'function') {
      return value();
    }
    return value;
  }

  private exists(value: any): boolean {
    return value !== undefined && value !== null;
  }

  private getPhrase(valueTemplate: IValue, key: string, value?: Param) {
    let valueKey = this.defaultValueKey;
    if (this.exists(value)) {
      if (typeof value === 'number') {
        valueKey = this.pluralRules.select(value);
      } else {
        valueKey = String(value);
      }
    }
    const items = valueTemplate[valueKey] || valueTemplate[this.defaultValueKey];
    if (!items || !items.length ) {
      return this.emptyValue;
    }
    const phrase = this.getRandomVariation(items);
    if (phrase.indexOf(`{${key}}`) > -1) {
      return  phrase.replace(`{${key}}`, this.exists(value) && String(value) || this.emptyValue);
    }
    return phrase;
  }

  private getValueTemplate(sentence: ISentence, key: string): IValue | undefined {
    const { values } = sentence;
    if (values) {
      const valueTemplate = values[key];
      if (valueTemplate) {
        return valueTemplate;
      }
    }
    return undefined;
  }
}
