import { expect } from '../utils/test';
import { HasCap } from './has-cap';

describe('HasCap', () => {

  describe('and has caps are present on root', () => {

    it('should return true',
      async function() {

        const cap = new HasCap('makegnocchi');

        expect(
          await cap.check()
        ).to.be.true;

      }
    );
  });

});
