import * as sinon from 'sinon';
import 'sinon-as-promised';
import { expect } from 'chai';
import { backend, ExtendRoleSchema } from './index';

describe('ExtendRoleSchema', () => {

    let sandbox;

    beforeEach(() => {

        sandbox = sinon.sandbox.create();

    });

    afterEach(() => {

        sandbox.restore();

    });

    describe('when testing if logged-out user can view an event', () => {

        it('should return true', async () => {

            const backendMock = sandbox.stub(backend, 'getUsersRole');

            backendMock.resolves('logged-out');

            expect(await ExtendRoleSchema.isAbleTo('event:view', { userId: 5, eventOwnerId: 6})).to.be.false;

        });

    });

    describe('when testing if officer can view an event', () => {

        it('should return true', async () => {

            const backendMock = sandbox.stub(backend, 'getUsersRole');

            backendMock.resolves('eventOfficer');

            expect(await ExtendRoleSchema.isAbleTo('event:view', { userId: 5, eventOwnerId: 6})).to.be.true;

        });

    });

    describe('when testing if officer can edit an event', () => {

        describe('and the event belongs to the user', () => {

            it('should return true', async () => {

                const backendMock = sandbox.stub(backend, 'getUsersRole');

                backendMock.resolves('eventOfficer');

                expect(await ExtendRoleSchema.isAbleTo('event:edit', { userId: 5, eventOwnerId: 5})).to.be.true;

            });

        });

        describe('and the event does not belong to the user', () => {

            it('should return false', async () => {

                const backendMock = sandbox.stub(backend, 'getUsersRole');

                backendMock.resolves('eventOfficer');

                expect(await ExtendRoleSchema.isAbleTo('event:edit', { userId: 5, eventOwnerId: 6})).to.be.false;

            });

        });


    });

    describe('when testing if manager can edit an event', () => {

        it('should return true, whether or not they are the owner', async () => {

            const backendMock = sandbox.stub(backend, 'getUsersRole');

            backendMock.resolves('eventManager');

            expect(await ExtendRoleSchema.isAbleTo('event:view', { userId: 5, eventOwnerId: 6})).to.be.true;

            expect(await ExtendRoleSchema.isAbleTo('event:view', { userId: 5, eventOwnerId: 5})).to.be.true;

        });

    });

});