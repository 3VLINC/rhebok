import { Cap } from './cap';

export type AsyncCapParams = {
  test: (context: any) => Promise<boolean>;
};

export class AsyncCap extends Cap {

  constructor(
    name: string,
    private params: AsyncCapParams
  ) { 
    
    super( name );

  }

  public async test(context: any) {

    return await this.params.test(context);

  }

}