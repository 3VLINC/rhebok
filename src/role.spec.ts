import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { Role } from './role';
import { AsyncCap } from './async-cap';
import { BasicCap } from './basic-cap';

chai.use(chaiAsPromised);

let expect = chai.expect;

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
                  new BasicCap('create')
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
                new BasicCap('create')
              ]
            }
          );

          expect(await auth.can('test', 'delete')).to.be.false;

        }
      );

    });

  });

  describe('get children', () => {

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

});