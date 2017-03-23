import { Role } from './role';
import { HasCap } from '../caps/has-cap';
import { expect } from '../utils/test';
import { DuplicateRoleNameError } from '../errors';

describe('Role', () => {

  describe('can', () => {

    describe('when role has cap', () => {

      it('should return true',
        async function() {

          const RootRoleObj =
            new Role(
              'test',
              {
                caps: [
                  new HasCap('create')
                ]
              }
            );

          expect(await RootRoleObj.can('test', 'create')).to.be.true;

        }
      );

    });

    describe('when role does not have cap', () => {

      it('should return false',
        async function() {

          const auth = new Role(
            'test',
            {
              caps: [
                new HasCap('create')
              ]
            }
          );

          expect(await auth.can('test', 'delete')).to.be.false;

        }
      );

    });

  });

  describe('getChildren', () => {

    describe('when role has 3 children', () => {

      it('should return three children', () => {

        const role = new Role(
          'testrole',
          {
            children: [
              new Role(
                'one'
              ),
              new Role(
                'two'
              ),
              new Role(
                'three'
              )
            ]
          }
        );

        expect(role.getChildren().length).to.eql(3);

      });

    });

    describe('when role has no children', () => {

      it('should return no children', () => {

        let role;

        role = new Role(
          'testrole'
        );

        expect(role.getChildren().length).to.eql(0);

        role = new Role(
          'testrole',
          {
            children: [

            ]
          }
        );

        expect(role.getChildren().length).to.eql(0);

      });

    });

  });

  describe('validate', () => {

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

          expect(() => role.validate()).not.to.throw();

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

          expect(() => role.validate()).to.throw(DuplicateRoleNameError);

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

          expect(() => role.validate()).to.throw(DuplicateRoleNameError);

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

          expect(() => role.validate()).to.throw(DuplicateRoleNameError);

        });

      });

    });

  });

});
