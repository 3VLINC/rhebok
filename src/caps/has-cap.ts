import { ICap } from '../interfaces';
export type BasicCapParams = {

};

export class HasCap implements ICap {

  constructor(
    private name: string,
    private params?: BasicCapParams
  ) {

  }

  public getName() {

    return this.name;

  }

  public check(context?: any) {

    return Promise.resolve(true);

  }

};
