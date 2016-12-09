import { expect } from './utils/test';
import { Role } from './role';
import { ConditionalCap } from './conditional-cap';
import { HasCap } from './has-cap';
import { GetPathToRole } from './get-path-to-role';

describe('GetPathToRole', () => {

  const RootRoleObject = new Role(
    'grandparent',
    {
      children: [
        new Role(
          'aunt',
          {
            children: [
              new Role(
                'aunts son',
                {
                  children: [
                    new Role(
                      'aunts sons son'
                    )
                  ]
                }
              )
            ]
          }
        ),
        new Role(
          'parent',
          {
            caps: [
              new HasCap('create')
            ],
            children: [
              new Role(
                'me',
                {
                  caps: [
                    new HasCap('update')
                  ],
                  children: [
                    new Role(
                      'my child',
                      {
                        caps: [
                          new HasCap('modify')
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
         new Role(
          'uncle',
          {
            children: [
              new Role(
                'uncles daughter',
                {
                  children: [
                    new Role(
                      'uncles daughters daughter'
                    )
                  ]
                }
              )
            ]
          }
        ),
      ]
    }      
  );

  it('should build a tree to the family member', () => {

    let rolePath = [];

    GetPathToRole(RootRoleObject, 'grandparent', rolePath);

    expect(rolePath).to.eql(['grandparent']);

    rolePath = [];

    GetPathToRole(RootRoleObject, 'parent', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent']);

    rolePath = [];
    
    GetPathToRole(RootRoleObject, 'me', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent', 'me']);
    
    rolePath = [];

    GetPathToRole(RootRoleObject, 'my child', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent', 'me', 'my child']);

    rolePath = [];
    
    GetPathToRole(RootRoleObject, 'aunts sons son', rolePath)

    expect(rolePath).to.eql(['grandparent', 'aunt', 'aunts son', 'aunts sons son']);

    rolePath = [];

    GetPathToRole(RootRoleObject, 'uncles daughters daughter', rolePath)

    expect(rolePath).to.eql(['grandparent', 'uncle', 'uncles daughter', 'uncles daughters daughter']);

    rolePath = [];
    
    GetPathToRole(RootRoleObject, 'not found', rolePath)

    expect(rolePath).to.eql([]);

  });

});