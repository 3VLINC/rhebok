export interface ICap {
  getName(): any;
  check(context?: any): Promise<boolean>;
}

export interface IRole {
  getName(): string;
  getCaps(): ICap[];
  getChild(roleName: string): IRole;
  getChildren(): IRole[];
  can(roleName: string, capabilities: string | string[], context?: any): Promise<boolean>;
  validate(roleNames: string[]): IRole;
}

export interface IRoleParams {
  caps?: ICap[];
  children?: IRole[]
}