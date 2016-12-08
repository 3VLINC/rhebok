import { isArray, find, sortedUniq, cloneDeep, filter } from 'lodash';
import { RecursePath } from './recurse-path';
import { RecurseCaps } from './recurse-caps';
import { GenericCapObj } from './generic-cap';

export interface RoleObjParams {
  caps?: GenericCapObj[];
  inherits?: string;
  children?: RoleObj[];
};

export function Role (name: string, params?: RoleObjParams) {

  return new RoleObj(name, params);
   
}

export class RoleObj {

  constructor(
    private name: string,
    private params: RoleObjParams = {}
  ) {

  }

  getName() {
    
    return this.name;

  }

  getCaps() {

    return this.params.caps || [];
    
  }

  getChild(roleName: string) {

    return find(this.params.children, (child) => child.getName() === roleName );

  }

  getChildren() {

    return this.params.children || [];

  }

  async can(roleName:string, capabilities: string | string[], context?: any) {

    const rolePath = [];

    RecursePath(this, roleName, rolePath);

    return await RecurseCaps(this, rolePath, capabilities, context);

  }

}