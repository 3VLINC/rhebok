import { ICap } from '../interfaces';

export class MockCap implements ICap {

  constructor(private name: string) {

  }
  getName() {

    return this.name;

  }

  async check() {

    return true;

  }

}
