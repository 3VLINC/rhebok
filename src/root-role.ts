import { Role, RoleParams } from './role';
import { ValidateRole } from './validate-role';

export class RootRole extends Role {

  constructor(
    name: string,
    params: RoleParams = {}
    ) {

      super(name, params);

      ValidateRole(this);

    }

}