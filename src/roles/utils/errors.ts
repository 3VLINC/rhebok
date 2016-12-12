export class InvalidPathError extends Error {

  constructor(rolePath: string) {
    
    super(`Role ${rolePath} could not be found`);

  }
}

export class DuplicateRoleNameError extends Error {

  constructor(roleName: string) {

    super(`Role Names must be unique, but found duplicate role name: ${roleName}`);

  }
}