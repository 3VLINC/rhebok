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
            Role(
              'test',
              {
                caps: [
                  BasicCap('create')
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

          const auth = Role(
            'test',
            {
              caps: [
                BasicCap('create')
              ]
            }
          );

          expect(await auth.can('test', 'delete')).to.be.false;

        }
      );

    });

  //   describe('when role has children', () => {

  //     describe('and when a role is nested capability', () => {

  //       describe('and the capability is on the requested role', () => {
          
  //         it('should return true', 
  //           async function() {

  //             const auth = new Auth(
  //               [
  //                 Role(
  //                   'other'
  //                 ),
  //                 Role(
  //                   'parent',
  //                   {
  //                     caps: [
  //                       BasicCap('create')
  //                     ],
  //                     children: [
  //                       Role(
  //                         'child',
  //                         {
  //                           caps: [
  //                             BasicCap('update')
  //                           ],
  //                           children: [
  //                             Role(
  //                               'grandchild',
  //                               {
  //                                 caps: [
  //                                   BasicCap('modify')
  //                                 ]
  //                               }
  //                             )
  //                           ]
  //                         }
  //                       )
  //                     ]
  //                   }
  //                 )
  //               ]      
  //             );

  //             expect(await auth.can('child', 'update')).to.be.true;

  //           }
  //         );
  //       });

  //       describe('and the capability is on a child role', () => {
          
  //         it('should return false', 
  //           async function() {

  //             const auth = new Auth(
  //               [
  //                 Role(
  //                   'other'
  //                 ),
  //                 Role(
  //                   'parent',
  //                   {
  //                     caps: [
  //                       BasicCap('create')
  //                     ],
  //                     children: [
  //                       Role(
  //                         'child',
  //                         {
  //                           caps: [
  //                             BasicCap('update')
  //                           ],
  //                           children: [
  //                             Role(
  //                               'grandchild',
  //                               {
  //                                 caps: [
  //                                   BasicCap('modify')
  //                                 ]
  //                               }
  //                             )
  //                           ]
  //                         }
  //                       )
  //                     ]
  //                   }
  //                 )
  //               ]      
  //             );

  //             expect(await auth.can('child', 'modify')).to.be.false;

  //           }
  //         );
  //       });
        
  //       describe('and the capability is on a parent role', () => {
          
  //         it('should return true', 
  //           async function() {

  //             const auth = new Auth(
                
  //                 Role(
  //                   'parent',
  //                   {
  //                     caps: [
  //                       BasicCap('create')
  //                     ],
  //                     children: [
  //                       Role(
  //                         'child',
  //                         {
  //                           caps: [
  //                             BasicCap('update')
  //                           ]
  //                         }
  //                       )
  //                     ]
  //                   }
  //                 )      
  //             );

  //             expect(await auth.can('child', 'create')).to.be.true;

  //           }
  //         );
  //       });

  //     });

  //   });

  //   describe('when cap test is async', () => {

  //     const AsyncResolveTrue = function(context) {
  //       return Promise.resolve(true);
  //     }
      
  //     const AsyncResolveFalse = function(context) {
  //       return Promise.resolve(false);
  //     }

  //     const AsyncReject = function(context) {
  //       return Promise.reject(new Error('Throws'));
  //     }
      
  //     describe('and async test resolves with true', () => {

  //       it('should return true', 
  //         async function() {

  //           const auth = new Auth(
  //               [
  //                 Role(
  //                   'parent',
  //                   {
  //                     caps: [
  //                       AsyncCap(
  //                         'create',
  //                         {
  //                           test: AsyncResolveTrue
  //                         }
  //                       )
  //                     ]
  //                   }
  //                 )
  //               ]      
  //             );

  //             expect(await auth.can('parent', 'create')).to.be.true;

  //         }
  //       );

  //     });

  //     describe('and async test resolves with false', () => {

  //       it('should return false',
  //         async function() {

  //           const auth = new Auth(
  //               [
  //                 Role(
  //                   'parent',
  //                   {
  //                     caps: [
  //                       AsyncCap(
  //                         'create',
  //                         {
  //                           test: AsyncResolveFalse
  //                         }
  //                       )
  //                     ]
  //                   }
  //                 )
  //               ]      
  //             );

  //             expect(await auth.can('parent', 'create')).to.be.false;

  //         }
  //       );

  //     });

  //     describe('and async test rejects', () => {

  //       it('should throw the error',
  //         async function() {

  //           const auth = new Auth(
  //               [
  //                 Role(
  //                   'parent',
  //                   {
  //                     caps: [
  //                       AsyncCap(
  //                         'create',
  //                         {
  //                           test: AsyncReject
  //                         }
  //                       )
  //                     ]
  //                   }
  //                 )
  //               ]      
  //             );

  //             return expect(
  //               auth.can('parent', 'create')
  //             ).to.be.rejectedWith(/Throws/);

  //         }
  //       );

  //     });

  //   });

  //   describe('when role is not found', () => {

  //     it('should reject with RoleNotFound error.', () => {

  //       const auth = new Auth(
  //         [
  //           Role(
  //             'parent',
  //             {
  //               caps: [
  //                 BasicCap(
  //                   'create'
  //                 )
  //               ]
  //             }
  //           )
  //         ]      
  //       );

  //       return expect(
  //         auth.can('badrole', 'create')
  //       ).to.be.rejectedWith(/Role badrole could not be found/)

  //     });

  //   });

  });

});