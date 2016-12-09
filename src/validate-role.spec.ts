import { Role } from './role';
import { ValidateRole } from './validate-role';
import { ConditionalCap } from './conditional-cap';
import { HasCap } from './has-cap';
import { DuplicateRoleNameError } from './errors';
import { expect } from './utils/test';

describe('ValidateRole', () => {

  describe('when a role name is used only once', () => {

    it('should return true', () => {

      const role = new Role('a',
          {
            children: [
              new Role('b',
              {
                children: [
                  new Role('d')
                ]
              }),
              new Role('c', {
                children: [
                  new Role('e')
                ]
              })
            ]
          }
        );

        expect(ValidateRole(role)).to.be.true;

    });

  });

  describe('when a role name is used more than once', () => {

    describe('when nested roles have the same name', () => {

      it('should throw an error', () => {

        const role = new Role('a',
          {
            children: [
              new Role('a')
            ]
          }
        );

        expect(() => ValidateRole(role)).to.throw(DuplicateRoleNameError);

      });

    });

    describe('when sibling roles have the same name', () => {

      it('should throw an error', () => {

        const role = new Role('a',
          {
            children: [
              new Role('b'),
              new Role('b')
            ]
          }
        );

        expect(() => ValidateRole(role)).to.throw(DuplicateRoleNameError);

      });

    });

    describe('when roles in separate hierarchies have the same name', () => {

      it('should throw an error', () => {

        const role = new Role('a',
          {
            children: [
              new Role('b',
              {
                children: [
                  new Role('d')
                ]
              }),
              new Role('c', {
                children: [
                  new Role('d')
                ]
              })
            ]
          }
        );

        expect(() => ValidateRole(role)).to.throw(DuplicateRoleNameError);

      });

    });

  });

  

});