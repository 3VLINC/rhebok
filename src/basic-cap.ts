import { GenericCapObj } from './generic-cap';

export interface BasicCapObjParams {

};

export function BasicCap(name: string, params?:BasicCapObjParams) {
  
  return new BasicCapObj(name, params);

}

export class BasicCapObj extends GenericCapObj {
  
  constructor(
    name: string,
    private params?:BasicCapObjParams
  ) {
    
    super( name );

  }

  public async test() {

    return true;

  }

};