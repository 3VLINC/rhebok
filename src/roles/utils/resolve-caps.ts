import { isArray, intersection, find, filter } from 'lodash';

import { Role } from '../role';
import { InvalidPathError, NoRolePathError } from './errors';

export const ResolveCaps = async (role: Role, rolePath: string[], capsLeftToCheck: string | string[] = [], context?: any) => {

  if (rolePath.length === 0) {

    throw new NoRolePathError();

  }

  if (!role || (role.getName() !== rolePath[0])) {

    throw new InvalidPathError(rolePath[0]);

  } else {
    
    // shift top level item off;
    rolePath.shift();

  }

  if (!isArray(capsLeftToCheck)) { capsLeftToCheck = [capsLeftToCheck] }
  
  for (let cap of capsLeftToCheck) {

    const capToCheck = find(role.getCaps(), (roleCap) => roleCap.getName() === cap);
    
    if (capToCheck) {

      const test = await capToCheck.check(context);

      if (true === test) {

        capsLeftToCheck = filter(capsLeftToCheck, (capLeftToCheck) => capLeftToCheck !== cap);

      }
      
    }

  }

  if (capsLeftToCheck.length === 0) {
    
    return true;

  } else if (rolePath.length > 0) {
    
    return await ResolveCaps(role.getChild(rolePath[0]), rolePath, capsLeftToCheck, context);

  }

  return false;

}