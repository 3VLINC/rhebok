import { Cap } from './cap';

export type BasicCapParams = {

};

export class BasicCap extends Cap {
  
  constructor(
    name: string,
    private params?:BasicCapParams
  ) {
    
    super( name );

  }

  public async test() {

    return true;

  }

};