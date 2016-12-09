import { Cap } from './cap';
import { Role } from '../roles/role';

export type SubRoleCapParams = {
  role: Role,
  getRoleName: (context: any) => Promise<string>
};

export class SubRoleCap extends Cap {

  constructor(name: string, private params: SubRoleCapParams) {

    super(name);

  }

  public async check(context: any) {
    
    const role = await this.params.getRoleName(context);

    return await this.params.role.can(role, this.getName(), context);

  }

}