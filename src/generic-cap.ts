export abstract class GenericCapObj {

  constructor(private name: string ) {

  }

  public getName() {

    return this.name;
    
  }

  public abstract async test(context?: any): Promise<boolean>;

}