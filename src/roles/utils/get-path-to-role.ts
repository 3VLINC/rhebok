import { Role } from '../role';

export const GetPathToRole = (role: Role, roleName: string, rolePath: string[] = []) => {

    if (role.getName() === roleName) {

      rolePath.push(role.getName());

      return true;

    } else {

      rolePath.push(role.getName());

      for(let child of role.getChildren()) {
        
        if(GetPathToRole(child, roleName, rolePath)) {

          return true;

        } 

      }

      rolePath.pop();

    }

    return false;

  }