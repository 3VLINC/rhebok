import { ICap } from '../interfaces';

export type AsyncCapParams = {
  if: (context: any) => Promise<boolean>;
};

export class ConditionalCap implements ICap {

  constructor(
    private name: string,
    private params: AsyncCapParams
  ) {

  }

  getName() {

    return this.name;

  }

  public async if(context?: any) {

    return await this.params.if(context);

  }

  public async check(context?: any) {

    return this.if(context);

  }

}
