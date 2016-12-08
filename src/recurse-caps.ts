import { isArray, intersection, find, filter } from 'lodash';

import { RoleObj } from './role';

export class InvalidPathError extends Error {

  constructor(rolePath: string) {
    
    super(`Role ${rolePath} could not be found`);

  }
}

export class NoRolePathError extends Error {

  constructor() {

    super(`No role path provided`);

  }

}

export const RecurseCaps = async (roleObj: RoleObj, rolePath: string[], capsLeftToCheck: string | string[] = [], context?: any) => {

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
    
    return await RecurseCaps(roleObj.getChild(rolePath[0]), rolePath, capsLeftToCheck, context);

  }

  return false;

}