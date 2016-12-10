import { expect, sinon } from '../utils/test';
import { SubRoleCap } from './sub-role-cap';
import { Role } from '../roles/role';
import { RootRole } from '../roles/root-role';
import { HasCap } from './has-cap';
import { InvalidPathError } from '../roles/utils/errors';
import { MockCap } from '../utils/mock-cap';

describe('SubRoleCap', () => {

  let sandbox, testRole, mockCap, mockCapCheck;
  const subRoleName = 'MasterChef';

  beforeEach(function() {

    sandbox = sinon.sandbox.create();

    mockCap = new MockCap('duck');
    mockCapCheck = sandbox.stub(mockCap, 'check');

    testRole = new RootRole(
      'root',
      {
        children: [
          new Role(
            'AssistantChef',
            {
              caps: [
              ],
              children: [
                new Role(
                  subRoleName,
                  {
                    caps: [
                      mockCap
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    );
    
  });

  afterEach(function() {

    sandbox.restore();

  });

  

  const RoleNameFetcher = {
    getRoleName: async (context) => { return ''; }
  };
  
  describe('when desired role on sub role is not found', () => {

    it('should return true',
      async function() {

        sandbox.stub(RoleNameFetcher, 'getRoleName').resolves('UnknownRole');

        const subRoleCap = new SubRoleCap(
          mockCap.getName(),
          {
            role: testRole,
            getRoleName: RoleNameFetcher.getRoleName
          }
        );

        return expect(
          subRoleCap.check({})
        ).to.be.rejectedWith(InvalidPathError);
        
      }
    );
  });

  describe('when desired role on sub role is found', () => {

    describe('and capability resolves with false', () => {

      it('should return false',
        async function() {

          sandbox.stub(RoleNameFetcher, 'getRoleName').resolves(subRoleName);

          mockCapCheck.resolves(false);

          const subRoleCap = new SubRoleCap(
            mockCap.getName(),
            {
              role: testRole,
              getRoleName: RoleNameFetcher.getRoleName
            }
          );

          expect(
            await subRoleCap.check({})
          ).to.be.false;

        }
      );

    });

    describe('and capability resolves with true', () => {

      it('should return true',
        async function() {

          sandbox.stub(RoleNameFetcher, 'getRoleName').resolves(subRoleName);

          mockCapCheck.resolves(true);

          const subRoleCap = new SubRoleCap(
            mockCap.getName(),
            {
              role: testRole,
              getRoleName: RoleNameFetcher.getRoleName
            }
          );

          expect(
            await subRoleCap.check({})
          ).to.be.true;

        }
      );

    });

  });

});