import { Cap } from '../caps/cap';

export class MockCap extends Cap {

  async check() {
    
    return true;

  }

}