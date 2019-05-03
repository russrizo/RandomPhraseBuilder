import { expect } from 'chai';
import 'mocha';
import { validator } from '../src';
import { ISentence } from '../src';

describe('Validator', () => {
  it('should be valid message with multiple variants', () => {
    const sentence = {
      variations: [
        'Test phrase 1',
        'Test phrase 2',
        'Test phrase 3',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with single variant', () => {
    const sentence = {
      variations: [
        'Test phrase 1',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with multiple templates and replacement value', () => {
    const sentence = {
      variations: [
        'Test phrase {value}',
        'Test phrase {value}',
        'Test phrase {value}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with default value ', () => {
    const sentence: ISentence = {
      values: {
        value: {
          default: [ 'value'],
        },
      },
      variations: [
        'Test phrase {value}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with default value template ', () => {
    const sentence: ISentence = {
      values: {
        value: {
          default: [ 'value {value}'],
        },
      },
      variations: [
        'Test phrase {value}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with value mapping', () => {
    const sentence: ISentence = {
      values: {
        value: {
          one: ['uno'],
          three: ['treas'],
          two: ['dos'],
        },
      },
      variations: [
        'Test phrase {value}',
        'Test phrase {value}',
        'Test phrase {value}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with value mapping template replacement', () => {
    const sentence: ISentence = {
      values: {
        value: {
          one: ['uno - {value}'],
          three: ['treas - {value}'],
          two: ['dos - {value}'],
        },
      },
      variations: [
        'Test phrase {value}',
        'Test phrase {value}',
        'Test phrase {value}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with adding new value template in value template', () => {
    const sentence: ISentence = {
      values: {
        parent: {
          default: ['{parent} has {son}'],
        },
        son: {
          default: ['son {son}'],
        },
      },
      variations: [
        'Let say {parent}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with only template in variations', () => {
    const sentence: ISentence = {
      variations: [
        '{parent}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be valid message with multiple template in variations', () => {
    const sentence: ISentence = {
      variations: [
        '{parent}{parent}{parent}',
      ],
    };
    const result = validator(sentence);
    expect(result).to.equal(true);
  });

  it('should be invalid with no variants', () => {
    const sentence = {
      variations: [],
    };
    const result = validator(sentence);
    expect(result).to.equal(false);
  });

  it('should be invalid with no values templates', () => {
    const sentence = {
      values: {
        value: {
          default: [],
        },
      },
      variations: ['test'],
    };
    const result = validator(sentence);
    expect(result).to.equal(false);
  });

  it('should be invalid with non closed bracket in variations', () => {
    const sentence = {
      variations: ['{test'],
    };
    const result = validator(sentence);
    expect(result).to.equal(false);
  });

  it('should be invalid with non opening bracket in variations', () => {
    const sentence = {
      variations: ['test}'],
    };
    const result = validator(sentence);
    expect(result).to.equal(false);
  });

  it('should be invalid with double opening bracket in variations', () => {
    const sentence = {
      variations: ['{{test}'],
    };
    const result = validator(sentence);
    expect(result).to.equal(false);
  });

  it('should be invalid with double closing bracket in variations', () => {
    const sentence = {
      variations: ['{test}}'],
    };
    const result = validator(sentence);
    expect(result).to.equal(false);
  });

  it('should be invalid with double closing bracket in variations', () => {
    const sentence = {
      variations: ['{{test}}'],
    };
    const result = validator(sentence);
    expect(result).to.equal(false);
  });

});
