import { isArray, find, sortedUniq, cloneDeep, filter } from 'lodash';
import { GetPathToRole } from './get-path-to-role';
import { ResolveCaps } from './resolve-caps';
import { Cap } from './cap';

export type RoleParams = {
  caps?: Cap[];
  inherits?: string;
  children?: Role[];
};

export class Role {

  constructor(
    private name: string,
    private params: RoleParams = {}
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

    GetPathToRole(this, roleName, rolePath);

    return await ResolveCaps(this, rolePath, capabilities, context);

  }

}