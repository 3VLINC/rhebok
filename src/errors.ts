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