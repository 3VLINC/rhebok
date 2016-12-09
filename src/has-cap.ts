import { Cap } from './cap';

export type BasicCapParams = {

};

export class HasCap extends Cap {
  
  constructor(
    name: string,
    private params?:BasicCapParams
  ) {
    
    super( name );

  }

  public check(context?: any) {
    
    return Promise.resolve(true);

  }

};