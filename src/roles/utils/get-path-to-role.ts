import { cloneDeep } from 'lodash';
import { IRole } from '../../interfaces';

export const GetPathToRole = (role: IRole, roleName: string, rolePath: string[] = []) => {

  if (role.getName() === roleName) {

    rolePath.push(role.getName());

    return rolePath;

  } else {

    rolePath.push(role.getName());

    for (let child of role.getChildren()) {

      const oldRolePath = cloneDeep(rolePath);

      const newRolePath = GetPathToRole(child, roleName, rolePath);

      if (oldRolePath.length !== newRolePath.length) {

        return rolePath;

      }

    }

    rolePath.pop();

  }

  return rolePath;

};
