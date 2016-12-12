import { Role } from '../role';
import { DuplicateRoleNameError } from './errors';

export const ValidateRole = (role: Role, roleNames: string[] = []) => {

  if (-1 !== roleNames.indexOf(role.getName())) {

      throw new DuplicateRoleNameError(role.getName())

    } else {

      roleNames.push(role.getName());

      for(let child of role.getChildren()) {
        
        ValidateRole(child, roleNames); 

      }

    }

    return true;

}