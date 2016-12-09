import { Cap } from './cap';

export type AsyncCapParams = {
  if: (context: any) => Promise<boolean>;
};

export class ConditionalCap extends Cap {

  constructor(
    name: string,
    private params: AsyncCapParams
  ) { 
    
    super( name );

  }

  public async if(context?: any) {

    return await this.params.if(context);

  }

  public async check(context?: any) {

    return this.if(context);

  }

}