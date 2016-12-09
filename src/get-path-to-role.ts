import { RoleObj } from './role';

export const GetPathToRole = (roleObj: RoleObj, roleName: string, rolePath: string[] = []) => {

    if (roleObj.getName() === roleName) {

      rolePath.push(roleObj.getName());

      return true;

    } else {

      rolePath.push(roleObj.getName());

      for(let child of roleObj.getChildren()) {
        
        if(GetPathToRole(child, roleName, rolePath)) {

          return true;

        } 

      }

      rolePath.pop();

    }

    return false;

  }