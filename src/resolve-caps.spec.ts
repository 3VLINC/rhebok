import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { Role } from './role';
import { ResolveCaps, InvalidPathError } from './resolve-caps';
import { AsyncCap } from './async-cap';
import { BasicCap } from './basic-cap';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('ResolveCaps', () => {

  describe('when given an invalid path to a role', () => {

    describe('when root path is bad', () => {

      it('should return false', 
        async () => {

          const RootRoleObject = Role(
            'grandparent'
          );

          return expect(
            ResolveCaps(RootRoleObject, ['grandparuuent', 'somebadpath'], 'makepizza')
          ).to.be.rejectedWith(/Role grandparuuent could not be found/);

      });

    });

    describe('when path is empty', () => {

      it('should return false', 
        async () => {

          const RootRoleObject = Role(
            'grandparent'
          );

          return expect(
            ResolveCaps(RootRoleObject, [], 'makepizza')
          ).to.be.rejectedWith(/No role path provided/);

      });

    });

    describe('when a child path does not exist', () => {
      
      it('should return false', 
        async () => {

          const RootRoleObject = Role(
            'grandparent',
            {
              children: [
                Role('validpath')
              ]
            }
          );

          return expect(
            ResolveCaps(RootRoleObject, ['grandparent', 'somebadpath'], 'makepizza')
          ).to.be.rejectedWith(/Role somebadpath could not be found/);

      });

    });
    

  });

  describe('when given a valid path to a role', () => {

    describe('and basic caps are present on root', () => {

      it('should return true',
        async function() {

          const RootRoleObject = Role(
            'grandparent',
            {
              caps: [
                BasicCap('makegnocchi')
              ]
            }
          );

          expect(
            await ResolveCaps(RootRoleObject, ['grandparent'], 'makegnocchi')
          ).to.be.true;
          
        }
      );
    });

    describe('and basic caps is not present on root', () => {

      it('should return true',
        async function() {

          const RootRoleObject = Role(
            'grandparent',
            {
              caps: [
                BasicCap('makelasagna')
              ]
            }
          );

          expect(
            await ResolveCaps(RootRoleObject, ['grandparent'], 'makegnocchi')
          ).to.be.false;
          
        }
      );
    });

    describe('and basic caps are present on self or parents', () => {

      it('should return true',
        async function() {

          const RootRoleObject = Role(
            'grandparent',
            {
              caps: [
                BasicCap('makepizza')
              ],
              children: [
                Role('aunt',
                  {
                    caps: [
                      BasicCap('makegnocchi')
                    ]
                  }
                )
              ]              
            }
          );

          expect(
            await ResolveCaps(RootRoleObject, ['grandparent', 'aunt'], ['makegnocchi', 'makepizza'])
          ).to.be.true;
          
        }
      );
  
    });

    describe('and not all basic caps are present on self or parents', () => {

      it('should return true',
        async function() {

          const RootRoleObject = Role(
            'grandparent',
            {
              caps: [
                BasicCap('makepizza')
              ],
              children: [
                Role('aunt',
                  {
                    caps: [
                      BasicCap('makegnocchi')
                    ]
                  }
                )
              ]              
            }
          );

          expect(
            await ResolveCaps(RootRoleObject, ['grandparent', 'aunt'], ['makegnocchi', 'makepizza', 'makegold'])
          ).to.be.false;
          
        }
      );
  
    });

    describe('and async cap is present and resolves true', () => {

      it('should return true',
        async function() {

          const RootRoleObject = Role(
            'grandparent',
            {
              children: [
                Role('aunt',
                  {
                    caps: [
                      AsyncCap(
                      'makelasagna',
                      {
                        test: async (context) => {
                          
                          const result = await Promise.resolve(context.vegetarian === true);
                          
                          return result;

                        } 
                      }
                    )
                    ]
                  }
                )
              ]              
            }
          );
          
          expect(
            await ResolveCaps(RootRoleObject, ['grandparent', 'aunt'], ['makelasagna'], { vegetarian: true })
          ).to.be.true;
          
        }
      );
  
    });

    describe('and async cap is present and resolves false', () => {

      it('should return true',
        async function() {

          const RootRoleObject = Role(
            'grandparent',
            {
              children: [
                Role('aunt',
                  {
                    caps: [
                      AsyncCap(
                      'makelasagna',
                      {
                        test: async (context) => {
                          
                          const result = await Promise.resolve(context.vegetarian === true);
                          
                          return result;

                        } 
                      }
                    )
                    ]
                  }
                )
              ]              
            }
          );
          
          expect(
            await ResolveCaps(RootRoleObject, ['grandparent', 'aunt'], ['makelasagna'], { vegetarian: false })
          ).to.be.false;
          
        }
      );
  
    });

    describe('and async cap is present and throws', () => {

      it('should throw an error',
        async function() {

          const RootRoleObject = Role(
            'grandparent',
            {
              children: [
                Role('aunt',
                  {
                    caps: [
                      AsyncCap(
                      'makelasagna',
                      {
                        test: async (context) => {
                          
                          throw new Error('Error');

                        } 
                      }
                    )
                    ]
                  }
                )
              ]              
            }
          );
          
          return expect(
            ResolveCaps(RootRoleObject, ['grandparent', 'aunt'], ['makelasagna'], { vegetarian: false })
          ).to.be.rejectedWith('Error');
          
        }
      );
  
    });

  });

});