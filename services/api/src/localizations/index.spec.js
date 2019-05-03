import { buildLocalizer as sut } from './index';
import { expect } from 'chai';

describe('./libs/localizations/index', () => {
  describe('given a map of localizations by langCode', () => {
    const langCode = 'en';

    const unknownPath = 'unknownPath';

    const path = 'path';
    const value = 'value';

    const pathFn = 'pathFn';
    const pathFnValue = ({ a }) => `${a} value`;

    const locMap = {
      [langCode]: {
        [path]: value,
        [pathFn]: pathFnValue,
      },
      fr: {},
    };
    describe('given a language code', () => {
      describe('when building a localizer', () => {
        const localizer = sut(locMap)(langCode, true);

        it('it should return a localizer function', () => {
          expect(typeof localizer).to.equal('function');
        });
      });

      describe('given a localizer function', () => {
        const localizer = sut(locMap)(langCode, true);
        describe('when retrieving a value from a valid path', () => {
          const phrase = localizer(path);

          it('it should return the localized phrase', () => {
            expect(phrase).to.equal(value);
          });
        });

        describe('when retrieving a value from a invalid path', () => {
          const phrase = localizer('unknown path');

          it('it should return an empty phrase', () => {
            expect(phrase).to.equal('');
          });
        });

        describe('when retrieving a value from a path that requires context', () => {
          const context = {
            a: 'replaced',
          };
          const phrase = localizer(pathFn, context);

          it('it should replace the placeholders and return the phrase', () => {
            expect(phrase).to.equal('replaced value');
          });
        });
      });
    });

    describe('given a node env of test', () => {
      const localizer = sut(locMap)(langCode, false);

      describe('when retrieving a value from a invalid path', () => {
        const phrase = localizer(unknownPath);

        it('it should return phrase indicating a missing localization', () => {
          expect(phrase).to.equal(
            `${langCode} --- ${unknownPath} --- this path is not localized`
          );
        });
      });
    });
  });
});
