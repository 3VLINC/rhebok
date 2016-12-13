import { MockCap } from './mock-cap';
import { expect } from './test';

describe('MockCap', () => {

  describe('check', () => {

    it('should return a promise that resolves to true', 
      async () => {

      const mockCap = new MockCap('samplecap');

      const result = await mockCap.check();

      expect(result).to.be.true;

    });

  });

});