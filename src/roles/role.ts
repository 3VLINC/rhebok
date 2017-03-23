import { find } from 'lodash';
import { GetPathToRole } from './utils/get-path-to-role';
import { ResolveCaps } from './utils/resolve-caps';
import { IRoleParams, IRole, ICap } from '../interfaces';
import { DuplicateRoleNameError } from '../errors';

export class Role implements IRole {

  constructor(
    private name: any,
    private params: IRoleParams = {}
  ) {

  }

  getName() {

    return this.name;

  }

  getCaps() {

    return this.params.caps || [] as ICap[];

  }

  getChild(roleName: string) {

    return find(this.params.children, (child) => child.getName() === roleName );

  }

  getChildren() {

    return this.params.children || [] as IRole[];

  }

  async can(roleName: string, capabilities: string | string[], context?: any) {

    return await ResolveCaps(this, GetPathToRole(this, roleName), capabilities, context);

  }

  validate(roleNames: string[] = []) {

    if (-1 !== roleNames.indexOf(this.getName())) {

      throw new DuplicateRoleNameError(this.getName());

    } else {

      roleNames.push(this.getName());

      for (let child of this.getChildren()) {

        child.validate(roleNames);

      }

    }

    return this;

  }

}
