"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PhraseBuilder = (function () {
    function PhraseBuilder(options) {
        if (options === void 0) { options = { icu: false }; }
        this.defaultValueKey = 'default';
        this.emptyValue = '';
        this.locale = 'en-US';
        this.sentenceBundle = undefined;
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
        }
        else {
            this.pluralRules = { select: function (value) {
                    return value.toString();
                }
            };
        }
    }
    PhraseBuilder.prototype.hasICULocaleSupport = function (januaryString) {
        try {
            var january = new Date(9e8);
            var month = new Intl.DateTimeFormat(this.locale, { month: 'long' });
            return month.format(january) === januaryString;
        }
        catch (err) {
            return false;
        }
    };
    PhraseBuilder.prototype.getText = function (node, params) {
        if (params === void 0) { params = {}; }
        var sentence;
        if (typeof node === 'string' && this.sentenceBundle) {
            sentence = this.sentenceBundle[node];
        }
        else {
            sentence = node;
        }
        var variation = this.getRandomVariation(sentence.variations);
        if (variation === undefined) {
            return '';
        }
        var match = /{([\w-_]+)}/g.exec(variation);
        while (match && match.length > 1) {
            var key = match[1];
            var parameter = this.getParamValue(key, params);
            var phrase = '';
            var valueTemplate = this.getValueTemplate(sentence, key);
            if (valueTemplate) {
                phrase = this.getPhrase(valueTemplate, key, parameter);
            }
            else {
                phrase = String(parameter) || this.emptyValue;
            }
            variation = variation.replace("{" + key + "}", phrase);
            match = /{([\w-_]+)}/g.exec(variation);
        }
        return variation;
    };
    PhraseBuilder.prototype.getRandomVariation = function (options) {
        if (options.length > 1) {
            return options[Math.floor(Math.random() * options.length)];
        }
        return options[0];
    };
    PhraseBuilder.prototype.getParamValue = function (key, params) {
        var _a = key, value = params[_a];
        if (value === null || value === undefined) {
            return undefined;
        }
        if (typeof value === 'function') {
            return value();
        }
        return value;
    };
    PhraseBuilder.prototype.exists = function (value) {
        return value !== undefined && value !== null;
    };
    PhraseBuilder.prototype.getPhrase = function (valueTemplate, key, value) {
        var valueKey = this.defaultValueKey;
        if (this.exists(value)) {
            if (typeof value === 'number') {
                valueKey = this.pluralRules.select(value);
            }
            else {
                valueKey = String(value);
            }
        }
        var items = valueTemplate[valueKey] || valueTemplate[this.defaultValueKey];
        if (!items || !items.length) {
            return this.emptyValue;
        }
        var phrase = this.getRandomVariation(items);
        if (phrase.indexOf("{" + key + "}") > -1) {
            return phrase.replace("{" + key + "}", this.exists(value) && String(value) || this.emptyValue);
        }
        return phrase;
    };
    PhraseBuilder.prototype.getValueTemplate = function (sentence, key) {
        var values = sentence.values;
        if (values) {
            var valueTemplate = values[key];
            if (valueTemplate) {
                return valueTemplate;
            }
        }
        return undefined;
    };
    return PhraseBuilder;
}());
exports.PhraseBuilder = PhraseBuilder;
//# sourceMappingURL=phrase-builder.js.map