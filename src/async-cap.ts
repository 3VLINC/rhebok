import { GenericCapObj } from './generic-cap';

export interface AsyncCapObjParams {
  test: (context: any) => Promise<Boolean>;
};

export class AsyncCapObj extends GenericCapObj {

  constructor(
    name: string,
    private params: AsyncCapObjParams
  ) { 
    
    super( name );

  }

  public async test(context: any) {

    return await this.params.test(context);

  }

}

export function AsyncCap(name:string, params: AsyncCapObjParams) {

  return new AsyncCapObj(name, params);

}