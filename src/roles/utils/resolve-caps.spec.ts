import { expect, sinon } from '../../utils/test';

import { Role } from '../role';
import { ResolveCaps } from './resolve-caps';
import { ConditionalCap } from '../../caps/conditional-cap';
import { SubRoleCap } from '../../caps/sub-role-cap';

import { Cap } from '../../caps/cap';
import { InvalidPathError, NoRolePathError } from './errors';

class MockCap extends Cap {

  async check() {
    
    return true;

  }

}

describe('ResolveCaps', () => {

  let sandbox;

  beforeEach(function() {

    sandbox = sinon.sandbox.create();

  });

  afterEach(function() {

    sandbox.restore();

  });

  describe('when given an invalid path to a role', () => {

    describe('when root path is bad', () => {

      it('should return false', 
        async () => {

          const RoleObject = new Role(
            'grandparent'
          );

          return expect(
            ResolveCaps(RoleObject, ['grandparuuent', 'somebadpath'], 'makepizza')
          ).to.be.rejectedWith(InvalidPathError);

      });

    });

    describe('when path is empty', () => {

      it('should return false', 
        async () => {

          const RoleObject = new Role(
            'grandparent'
          );

          return expect(
            ResolveCaps(RoleObject, [], 'makepizza')
          ).to.be.rejectedWith(NoRolePathError);

      });

    });

    describe('when a child path does not exist', () => {
      
      it('should return false', 
        async () => {

          const RoleObject = new Role(
            'grandparent',
            {
              children: [
                new Role('validpath')
              ]
            }
          );

          return expect(
            ResolveCaps(RoleObject, ['grandparent', 'somebadpath'], 'makepizza')
          ).to.be.rejectedWith(InvalidPathError);

      });

    });
    

  });

  describe('when given a valid path to a role', () => {

    describe('and cap is present', () => {
      
      const role = 'grandparent';
      const capName = 'makegnocchi';
      const cap = new MockCap(capName);
      let capMock;
      let roleObj;

      beforeEach(() => {
        
        capMock = sandbox.stub(cap, 'check');
        
        roleObj = new Role(
          role,
          {
            caps: [
              cap
            ]
          }
        );

      });

      describe('and cap resolves with true', () => {
        
        it('should return true',
          async function() {

            capMock.resolves(true);

            const result = await ResolveCaps(roleObj, ['grandparent'], 'makegnocchi', {});

            expect(capMock.called).to.be.true;

            expect(result).to.be.true;
            
          }
        );
      });

      describe('and cap resolves with false', () => {
        
        it('should return true',
          async function() {

            capMock.resolves(false);

            const result = await ResolveCaps(roleObj, ['grandparent'], 'makegnocchi', {});

            expect(capMock.called).to.be.true;

            expect(result).to.be.false;
            
          }
        );
      });

      describe('and cap rejects', () => {
        
        it('should reject',
          async function() {

            capMock.rejects(new Error());

            return expect(
              ResolveCaps(roleObj, ['grandparent'], 'makegnocchi', {})
            ).to.be.rejectedWith(Error);           
            
          }
        );
      });

    });

    describe('and cap is not present', () => {

      it('should return false',
        async function() {

          const cap = new MockCap('makegnocchi');

          const capMock = sandbox.stub(cap, 'check');

          const roleObj = new Role(
            'grandparent',
            {
              caps: [
                cap
              ]
            }
          );

          await ResolveCaps(roleObj, ['grandparent'], 'makepizza', {});

          expect(capMock.called).to.be.false;
          
        }
      );

    });

    describe('and all caps are present in stack', () => {

      const role1 = 'grandparent';
      const role2 = 'parent';
      const capName1 = 'makegnocchi';
      const cap1 = new MockCap(capName1);
      const capName2 = 'makepizza';
      const cap2 = new MockCap(capName2);
      let capMock1;
      let capMock2;
      let roleObj;

      beforeEach(() => {
        
        capMock1 = sandbox.stub(cap1, 'check');
        capMock2 = sandbox.stub(cap2, 'check');
        
        roleObj = new Role(
          role1,
          {
            caps: [
              cap1
            ],
            children: [
              new Role(
                role2,
                {
                  caps: [
                    cap2
                  ]
                }
              )
            ]
          }
        );

      });

      describe('if all caps resolve to true', () => {

        it('should return true',
          async function() {

            capMock1.resolves(true);
            capMock2.resolves(true);

            const result = await ResolveCaps(roleObj, [role1, role2], [capName1, capName2], {});

            expect(capMock1.called).to.be.true;
            expect(capMock2.called).to.be.true;

            expect(result).to.be.true;
            
          }
        );

      });

      describe('if first caps resolves true and second resolves false', () => {

        it('should return false',
          async function() {

            capMock1.resolves(true);
            capMock2.resolves(false);

            const result = await ResolveCaps(roleObj, [role1, role2], [capName1, capName2], {});

            expect(capMock1.called).to.be.true;
            expect(capMock2.called).to.be.true;

            expect(result).to.be.false;
            
          }
        );

      });

      describe('if first caps resolves false and second resolves true', () => {

        it('should return false',
          async function() {

            capMock1.resolves(false);
            capMock2.resolves(true);

            const result = await ResolveCaps(roleObj, [role1, role2], [capName1, capName2], {});

            expect(capMock1.called).to.be.true; 
            expect(capMock2.called).to.be.true; // it should call this because we want to keep checking if child override works

            expect(result).to.be.false;
            
          }
        );

      });

      describe('if all caps resolve to false', () => {

        it('should return false',
          async function() {

            capMock1.resolves(false);
            capMock2.resolves(false);

            const result = await ResolveCaps(roleObj, [role1, role2], [capName1, capName2], {});

            expect(capMock1.called).to.be.true; 
            expect(capMock2.called).to.be.true; // it should call this because we want to keep checking if child override works

            expect(result).to.be.false;
            
          }
        );

      });

      describe('if any cap rejects', () => {

        it('should reject',
          async function() {

            capMock1.resolves(false);
            capMock2.rejects(new Error());

            return expect(
              ResolveCaps(roleObj, [role1, role2], [capName1, capName2], {})
            ).to.be.rejectedWith(Error);
            
          }
        );

      });
  
    });

    describe('and not all caps are present in stack', () => {

      const role1 = 'grandparent';
      const role2 = 'parent';
      const capName1 = 'makegnocchi';
      const cap1 = new MockCap(capName1);
      const capName2 = 'makepizza';
      const cap2 = new MockCap(capName2);
      let capMock1;
      let capMock2;
      let roleObj;

      beforeEach(() => {
        
        capMock1 = sandbox.stub(cap1, 'check');
        capMock2 = sandbox.stub(cap2, 'check');
        
        roleObj = new Role(
          role1,
          {
            caps: [
              cap1
            ],
            children: [
              new Role(
                role2,
                {
                  caps: [
                    cap2
                  ]
                }
              )
            ]
          }
        );

      });

      it('should return false',
          async function() {

            capMock1.resolves(true);
            capMock2.resolves(true);

            const result = await ResolveCaps(roleObj, [role1, role2], [capName1, capName2, 'someothercap'], {});

            expect(capMock1.called).to.be.true;
            expect(capMock2.called).to.be.true;

            expect(result).to.be.false;
            
          }
        );

    });

  });

});