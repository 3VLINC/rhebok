import { expect } from '../../utils/test';
import { Role } from '../role';
import { ConditionalCap } from '../../caps/conditional-cap';
import { HasCap } from '../../caps/has-cap';
import { GetPathToRole } from './get-path-to-role';

describe('GetPathToRole', () => {

  const RoleObject = new Role(
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

    GetPathToRole(RoleObject, 'grandparent', rolePath);

    expect(rolePath).to.eql(['grandparent']);

    rolePath = [];

    GetPathToRole(RoleObject, 'parent', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent']);

    rolePath = [];
    
    GetPathToRole(RoleObject, 'me', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent', 'me']);
    
    rolePath = [];

    GetPathToRole(RoleObject, 'my child', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent', 'me', 'my child']);

    rolePath = [];
    
    GetPathToRole(RoleObject, 'aunts sons son', rolePath)

    expect(rolePath).to.eql(['grandparent', 'aunt', 'aunts son', 'aunts sons son']);

    rolePath = [];

    GetPathToRole(RoleObject, 'uncles daughters daughter', rolePath)

    expect(rolePath).to.eql(['grandparent', 'uncle', 'uncles daughter', 'uncles daughters daughter']);

    rolePath = [];
    
    GetPathToRole(RoleObject, 'not found', rolePath)

    expect(rolePath).to.eql([]);

  });

});