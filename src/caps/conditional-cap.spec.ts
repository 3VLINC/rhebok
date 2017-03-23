import { expect } from '../utils/test';
import { ConditionalCap } from './conditional-cap';

describe('ConditionalCap', () => {

  describe('and conditional cap is present and resolves true', () => {

    it('should return true',
      async function () {

        const cap = new ConditionalCap(
          'makelasagna',
          {
            if: async (context) => {

              const result = await Promise.resolve(context.vegetarian === true);

              return result;

            }
          }
        );

        expect(
          await cap.check({ vegetarian: true })
        ).to.be.true;

      }
    );

  });

  describe('and conditional cap is present and resolves false', () => {

    it('should return true',
      async function () {

        const cap = new ConditionalCap(
          'makelasagna',
          {
            if: async (context) => {

              const result = await Promise.resolve(context.vegetarian === true);

              return result;

            }
          }
        );

        expect(
          await cap.check({ vegetarian: false })
        ).to.be.false;

      }
    );

  });

  describe('and conditional cap is present and throws', () => {

    it('should throw an error',
      async function () {

        const cap = new ConditionalCap(
          'makelasagna',
          {
            if: async (context) => {

              throw new Error('Error');

            }
          }
        );

        return expect(
          cap.check({ vegetarian: false })
        ).to.be.rejectedWith('Error');

      }
    );

  });

});
