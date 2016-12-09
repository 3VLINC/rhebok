export abstract class Cap {

  constructor(private name: string ) {

  }

  public getName() {

    return this.name;
    
  }

  public abstract check(context?: any): Promise<boolean>;

}