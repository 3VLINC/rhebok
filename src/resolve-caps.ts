import { isArray, intersection, find, filter } from 'lodash';

import { RoleObj } from './role';
import { InvalidPathError, NoRolePathError } from './errors';

export const ResolveCaps = async (roleObj: RoleObj, rolePath: string[], capsLeftToCheck: string | string[] = [], context?: any) => {

  if (rolePath.length === 0) {

    throw new NoRolePathError();

  }

  if (!roleObj || (roleObj.getName() !== rolePath[0])) {

    throw new InvalidPathError(rolePath[0]);

  } else {
    
    // shift top level item off;
    rolePath.shift();

  }

  if (!isArray(capsLeftToCheck)) { capsLeftToCheck = [capsLeftToCheck] }
  
  for (let cap of capsLeftToCheck) {

    const capToCheck = find(roleObj.getCaps(), (roleCap) => roleCap.getName() === cap);
    
    if (capToCheck) {

      const test = await capToCheck.test(context);

      if (true === test) {

        capsLeftToCheck = filter(capsLeftToCheck, (capLeftToCheck) => capLeftToCheck !== cap);

      }
      
    }

  }

  if (capsLeftToCheck.length === 0) {
    
    return true;

  } else if (rolePath.length > 0) {
    
    return await ResolveCaps(roleObj.getChild(rolePath[0]), rolePath, capsLeftToCheck, context);

  }

  return false;

}