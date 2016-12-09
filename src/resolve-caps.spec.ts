import { expect } from './utils/test';

import { Role } from './role';
import { ResolveCaps } from './resolve-caps';
import { ConditionalCap } from './conditional-cap';
import { HasCap } from './has-cap';
import { InvalidPathError } from './errors';

describe('ResolveCaps', () => {

  describe('when given an invalid path to a role', () => {

    describe('when root path is bad', () => {

      it('should return false', 
        async () => {

          const RootRoleObject = new Role(
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

          const RootRoleObject = new Role(
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

          const RootRoleObject = new Role(
            'grandparent',
            {
              children: [
                new Role('validpath')
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

          const RootRoleObject = new Role(
            'grandparent',
            {
              caps: [
                new HasCap('makegnocchi')
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

          const RootRoleObject = new Role(
            'grandparent',
            {
              caps: [
                new HasCap('makelasagna')
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

          const RootRoleObject = new Role(
            'grandparent',
            {
              caps: [
                new HasCap('makepizza')
              ],
              children: [
                new Role('aunt',
                  {
                    caps: [
                      new HasCap('makegnocchi')
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

          const RootRoleObject = new Role(
            'grandparent',
            {
              caps: [
                new HasCap('makepizza')
              ],
              children: [
                new Role('aunt',
                  {
                    caps: [
                      new HasCap('makegnocchi')
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

          const RootRoleObject = new Role(
            'grandparent',
            {
              children: [
                new Role('aunt',
                  {
                    caps: [
                      new ConditionalCap(
                      'makelasagna',
                      {
                        if: async (context) => {
                          
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

          const RootRoleObject = new Role(
            'grandparent',
            {
              children: [
                new Role('aunt',
                  {
                    caps: [
                      new ConditionalCap(
                      'makelasagna',
                      {
                        if: async (context) => {
                          
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

    describe('and async cap is resolved with false on parent cap check but resolves with true on a child cap check', () => {

      it('should return true',
        async function() {

          const RootRoleObject = new Role(
            'grandparent',
            {
              children: [
                new Role('aunt',
                  {
                    caps: [
                      new ConditionalCap(
                        'makelasagna',
                        {
                          if: async (context) => {
                            
                            const result = await Promise.resolve(context.vegetarian === true);
                            
                            return result;

                          } 
                        }
                      )
                    ],
                    children: [
                      new Role(
                        'cousin',
                        {
                          caps: [
                            new ConditionalCap(
                              'makelasagna',
                              {
                                if: async (context) => {
                                  console.log(context);
                                  const result = await Promise.resolve(context.vegetarian === false);
                                  
                                  return result;

                                }
                              }
                            )
                          ]
                        }
                      )
                    ]
                  }
                )
              ]              
            }
          );
          
          expect(
            await ResolveCaps(RootRoleObject, ['grandparent', 'aunt', 'cousin'], ['makelasagna'], { vegetarian: false })
          ).to.be.true;
          
        }
      );
  
    });

    describe('and async cap is present and throws', () => {

      it('should throw an error',
        async function() {

          const RootRoleObject = new Role(
            'grandparent',
            {
              children: [
                new Role('aunt',
                  {
                    caps: [
                      new ConditionalCap(
                      'makelasagna',
                      {
                        if: async (context) => {
                          
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