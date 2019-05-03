# Simple Phrase Builder

## Simple examples
### Random message 
```js
const pb = new PhraseBuilder();
const sentence = {
  variations: [
    'Test phrase 1',
    'Test phrase 2',
    'Test phrase 3',
  ],
};
const sentence =  pb.getText(sentence);
// Test phrase 2
```
### Random message with placeholder
```js
const pb = new PhraseBuilder();
const sentence = {
    variations: [
      'Test phrase one with value {value}',
      'Test phrase two with value {value}',
      'Test phrase three with value {value}',
    ],
};
const sentence =  pb.getText(sentence, { value: 'VALUE'});
// Test phrase three with value VALUE
```
### Random message with placeholder and value template
```js
const pb = new PhraseBuilder();
const sentence = {
  values: {
    value: {
      one: ['uno - {value}'],
      three: ['treas - {value}'],
      two: ['dos - {value}'],
    },
 },
 variations: [
   'Test phrase {value}',
   'Another test phrase {value}',
 ],
};
const sentence =  pb.getText(sentence, { value: 'one' });
// Another test phrase uno - one
```
## API
### PhraseBuilder([options])
* emptyValue(string) - value to replace template if parameter is undefined/null
* defaultValueKey(string) - fallback key name for value template. Default: "default"
* locale(string) - used for detecting number pluralization. Default: en-US
* sentenceBundle - js object with multiple sentence templates
* icu(boolean)- indicate use icu or not

#### getText(sentence, [params])
* sentence - object which describe sentence
    ```js
    {
      description: 'sentence description',
      values: {
        value: { // param name from params
          one: ['uno - {value}'], // param value and array of values templates
          ...
        }
      }
      variations: [
        // Array of templates to choose from
        'This is template {value}'
      ]
  }
    ```
* params - object with sentence parameters

#### getText(sentenceKey, [params])
* sentenceKey - key for sentence object in sentenceBundle
* params - object with sentence parameters

