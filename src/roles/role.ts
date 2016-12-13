import { isArray, find, sortedUniq, cloneDeep, filter } from 'lodash';
import { GetPathToRole } from './utils/get-path-to-role';
import { ResolveCaps } from './utils/resolve-caps';
import { Cap } from '../caps/cap';
import { DuplicateRoleNameError } from './utils/errors';

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

    return await ResolveCaps(this, GetPathToRole(this, roleName), capabilities, context);

  }

  validate(roleNames: string[] = []) {

    if (-1 !== roleNames.indexOf(this.getName())) {

      throw new DuplicateRoleNameError(this.getName())

    } else {

      roleNames.push(this.getName());

      for(let child of this.getChildren()) {
        
        child.validate(roleNames); 

      }

    }

    return this;

  }

}