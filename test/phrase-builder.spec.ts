import { expect } from 'chai';
import Debug from 'debug';
import 'mocha';
import { ISentence, PhraseBuilder } from '../src';

const debug = Debug('us:PhraseBuilder');

describe('Phrase builder', () => {
  describe('Phrase builder without idu support', () => {
    const pb = new PhraseBuilder();

    it('should return value with multiple variants', () => {
      const sentence = {
        variations: [
          'Test phrase 1',
          'Test phrase 2',
          'Test phrase 3',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence);
        debug(text);
        expect(sentence.variations).to.include(text);
      }
    });

    it('should return value with single variant', () => {
      const sentence = {
        variations: [
          'Test phrase 1',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence);
        debug(text);
        expect(sentence.variations).to.include(text);
      }
    });

    it('should return value with empty variants list', () => {
      const sentence = {
        variations: [
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence);
        debug(text);
        expect(text).to.equal('');
      }
    });

    it('should return value with multiple templates and replacement value', () => {
      const sentence = {
        variations: [
          'Test phrase {value}',
          'Test phrase {value}',
          'Test phrase {value}',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence, { value: 'test' });
        debug(text);
        expect(text).to.equal('Test phrase test');
      }
    });

    it('should return value with multiple templates and replacement value function', () => {
      const sentence = {
        variations: [
          'Test phrase {value}',
          'Test phrase {value}',
          'Test phrase {value}',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence, {
          value: (): string => {
            return String(i % 3);
          },
        });
        debug(text);
        expect(['Test phrase 1', 'Test phrase 2', 'Test phrase 0']).to.include(text);
      }
    });

    it('should return value with multiple templates and replacement value function and value text', () => {
      const sentence = {
        variations: [
          'Test phrase {value} and {val}',
          'Test phrase {value} and {val}',
          'Test phrase {value} and {val}',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence, {
          val: 'test',
          value: (): string => {
            return String(i % 3);
          },
        });
        debug(text);
        expect(['Test phrase 1 and test', 'Test phrase 2 and test', 'Test phrase 0 and test']).to.include(text);
      }
    });

    it('should return value with default value template ', () => {
      const sentence: ISentence = {
        values: {
          value: {
            default: [ 'the {value}'],
          },
        },
        variations: [
          'Test phrase {value}',
          'Test phrase {value}',
          'Test phrase {value}',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence, {
          val: 'test',
          value: (): string => {
            return String(i % 3);
          },
        });
        debug(text);
        expect(['Test phrase the 1', 'Test phrase the 2', 'Test phrase the 0']).to.include(text);
      }
    });

    it('should return value with value mapping', () => {
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
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence, {
          value: (): string => {
            const values = ['one', 'two', 'three'];
            return values[i % 3];
          },
        });
        debug(text);
        expect(['Test phrase uno', 'Test phrase dos', 'Test phrase treas']).to.include(text);
      }
    });

    it('should return value with value mapping template replacement', () => {
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
      for (let i = 0; i < 10; i += 1) {
        const text = pb.getText(sentence, {
          value: (): string => {
            const values = ['one', 'two', 'three'];
            return values[i % 3];
          },
        });
        debug(text);
        expect(['Test phrase uno - one', 'Test phrase dos - two', 'Test phrase treas - three']).to.include(text);
      }
    });

    it('should return value with adding new template in value template', () => {
      const sentence: ISentence = {
        values: {
          parent: {
            default: ['{parent} has son {son}'],
          },
        },
        variations: [
          'Let say {parent}',
        ],
      };
      const text = pb.getText(sentence, {
        parent: 'Anaken',
        son: 'Luke',
      });
      debug(text);
      expect('Let say Anaken has son Luke').to.equal(text);
    });

    it('should return value with adding new value template in value template', () => {
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
      const text = pb.getText(sentence, {
        parent: 'Anaken',
        son: 'Luke',
      });
      debug(text);
      expect('Let say Anaken has son Luke').to.equal(text);
    });

    it('should return value with undefined value and value template', () => {
      const sentence: ISentence = {
        values: {
          parent: {
            default: ['{parent} has son'],
          },
        },
        variations: [
          'Let say {parent}',
        ],
      };
      const text = pb.getText(sentence);
      debug(text);
      expect('Let say  has son').to.equal(text);
    });

    it('should return value with numeric value 1', () => {
      const sentence: ISentence = {
        values: {
          number: {
            '1': ['{number} as one'],
          },
        },
        variations: [
          'Let print {number}',
        ],
      };
      const text = pb.getText(sentence, { number: 1});
      debug(text);
      expect('Let print 1 as one').to.equal(text);
    });

    it('should return value with numeric value ', () => {
      const sentence: ISentence = {
        values: {
          number: {
            '1': ['{number} as one'],
            default: ['{number} as others'],
          },
        },
        variations: [
          'Let print {number}',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const validate = (index: number) => {
          const text = pb.getText(sentence, { number: index});
          debug(text);
          if (index === 1) {
            expect('Let print 1 as one').to.equal(text);
          } else {
            expect(`Let print ${index} as others`).to.equal(text);
          }
        };
        validate(i);
      }
    });
  });

  describe('Phrase builder: Locale ru-RU', () => {
    const pb = new PhraseBuilder({ locale: 'ru-RU', icu: true });
    it('should has locale icu support', () => {
      const hasSupport = pb.hasICULocaleSupport('январь');
      expect(hasSupport).to.equal(true);
    });
    it('should return value with numeric value ', () => {
      const sentence: ISentence = {
        values: {
          number: {
            few: ['{number} as few'],
            many: ['{number} as many'],
            one: ['{number} as one'],
          },
        },
        variations: [
          'Let print {number}',
        ],
      };
      for (let i = 0; i < 10; i += 1) {
        const validate = (index: number) => {
          const text = pb.getText(sentence, { number: index});
          debug(text);
          if (index === 1) {
            expect('Let print 1 as one').to.equal(text);
          } else if (index > 0 && index < 5) {
            expect(`Let print ${index} as few`).to.equal(text);
          } else {
            expect(`Let print ${index} as many`).to.equal(text);
          }
        };
        validate(i);
      }
    });
  });
});
