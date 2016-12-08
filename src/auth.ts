import { isArray, find, sortedUniq } from 'lodash';

interface RoleObjParams {
  caps?: GenericCapObj[];
  inherits?: string;
  children?: RoleObj[];
};

interface BasicCapObjParams {

};

interface AsyncCapObjParams {
  test: (context: any) => Promise<Boolean>;
};

function BasicCap(name: string, params?:BasicCapObjParams) {
  
  return new BasicCapObj(name, params);

}

function AsyncCap(name:string, params: AsyncCapObjParams) {

  return new AsyncCapObj(name, params);

}

function Role (name: string, params?: RoleObjParams) {

  return new RoleObj(name, params);
   
}

abstract class GenericCapObj {

  constructor(private name: string ) {

  }

  public isNamed(capName: string) {

    return (this.name === capName);

  }

  public abstract async test(context?: any): Promise<Boolean>;

}

class BasicCapObj extends GenericCapObj {
  
  constructor(
    name: string,
    private params?:BasicCapObjParams
  ) {
    
    super( name );

  }

  public async test() {

    return true;

  }

};

class AsyncCapObj extends GenericCapObj {

  constructor(
    name: string,
    private params: AsyncCapObjParams
  ) { 
    
    super( name );

  }

  public async test(context: any) {

    return await this.params.test(context);

  }

}

class RoleObj {

  constructor(
    private name: string,
    private params: RoleObjParams = {}
  ) {

  }

  // Check the parent role for the capability
  // If not found there check the child roles
  private findCap(capName:string) {

    let capInRole;

    if (this.params.caps) { 

      for(let cap of this.getCaps()) {

        if (cap.isNamed(capName)) {

          return cap;

        } else if (this.getChildren()) {

          for(let childRole of this.getChildren()) {

            return childRole.findCap(capName);

          }

        }

      }

    }

    return capInRole;

  }

  // Loop through all top level roles
  // If the desired role name is found under the parent role
  // Then return the parent role

  public findParentRole(roleName: string) {

    if (this.isNamed(roleName)) {

      return this;

    } else if (this.getChildren()) {

      for(let childRole of this.getChildren()) {

        if (childRole.findParentRole(roleName)) {

          return this;

        }

      }
      
    }

  }

  public async passesCapTest(capName: string, context?: any) {

    const cap = this.findCap(capName);

    if (!cap) { return false; }

    return await cap.test(context);

  }

  public getCaps() {

    return this.params.caps;

  }

  public getChildren() {

    return this.params.children;

  }

  public isNamed(roleName: string) {

    return (roleName === this.name);

  }

}

class RoleNotFoundError extends Error {

  constructor(name: string) {
    super(`Role ${name} could not be found`);
  }
}

class Auth {

  private roles: RoleObj[] = [];

  constructor(
    roles: RoleObj[] | RoleObj
  ) {

    if(!isArray(roles)) { roles = [roles]; }

    this.roles = roles;

  }

  private findRole(roleName: string) {

    for(let role of this.roles) {

      let foundRole = role.findParentRole(roleName);

      if ( foundRole ) { return foundRole }

    }

  }

  public async can(roleName: string, capName:string, context?: any) {

    const role = this.findRole(roleName);

    if (role) {
      
      return role.passesCapTest(capName, context);    

    } else {
    
      throw new RoleNotFoundError(roleName);

    }

  }

}

export { Auth, Role, AsyncCap, BasicCap }
