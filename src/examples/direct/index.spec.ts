import { expect } from 'chai';
import { SimpleRoleSchema } from './index';

describe('SimpleRoleSchema', () => {

    describe('when testing if logged-out user can view an event', () => {

        it('should return true', async () => {

            expect(await SimpleRoleSchema.can('logged-out', 'event:view', { userId: 5, eventOwnerId: 6})).to.be.false;

        });

    });

    describe('when testing if officer can view an event', () => {

        it('should return true', async () => {


            expect(await SimpleRoleSchema.can('eventOfficer', 'event:view', { userId: 5, eventOwnerId: 6})).to.be.true;

        });

    });

    describe('when testing if officer can edit an event', () => {

        describe('and the event belongs to the user', () => {

            it('should return true', async () => {


                expect(await SimpleRoleSchema.can('eventOfficer', 'event:edit', { userId: 5, eventOwnerId: 5})).to.be.true;

            });

        });

        describe('and the event does not belong to the user', () => {

            it('should return false', async () => {

                expect(await SimpleRoleSchema.can('eventOfficer', 'event:edit', { userId: 5, eventOwnerId: 6})).to.be.false;

            });

        });


    });

    describe('when testing if manager can edit an event', () => {

        it('should return true, whether or not they are the owner', async () => {

            expect(await SimpleRoleSchema.can('eventManager', 'event:view', { userId: 5, eventOwnerId: 6})).to.be.true;

            expect(await SimpleRoleSchema.can('eventManager', 'event:view', { userId: 5, eventOwnerId: 5})).to.be.true;

        });

    });

});