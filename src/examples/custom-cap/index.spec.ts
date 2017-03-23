import { expect } from 'chai';
import { MyCustomCap } from './index';
import { Role } from '../../roles/role';

describe('CustomCap', () => {

    const role = new Role(
        'driver',
        {
            caps: [
                new MyCustomCap('go-through-light')
            ]
        }
    );

    describe('when at stoplight, if the light is red and it is not an emergency.', () => {

        it('should return false', async () => {

            expect(await role.can('driver', 'go-through-light', { color: 'red', isEmergency: false })).to.be.false;

        });

    });

    describe('when at stoplight, if the light is red and it is an emergency.', () => {

        it('should return true', async () => {

            expect(await role.can('driver', 'go-through-light', { color: 'red', isEmergency: true })).to.be.true;

        });

    });

});
