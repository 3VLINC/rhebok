import { ICap } from './../../index';

export class MyCustomCap implements ICap {

    constructor(private name: string) { }

    public getName() {

        return this.name;

    }

    public async check(context?: any) {

        if (context.isEmergency === true || context.color === 'green') { return true; }

        return false;

    }

}
