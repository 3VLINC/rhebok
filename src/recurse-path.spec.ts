import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { Role } from './role';
import { AsyncCap } from './async-cap';
import { BasicCap } from './basic-cap';
import { RecursePath } from './recurse-path';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('RecursePath', () => {

  const RootRoleObject = Role(
    'grandparent',
    {
      children: [
        Role(
          'aunt',
          {
            children: [
              Role(
                'aunts son',
                {
                  children: [
                    Role(
                      'aunts sons son'
                    )
                  ]
                }
              )
            ]
          }
        ),
        Role(
          'parent',
          {
            caps: [
              BasicCap('create')
            ],
            children: [
              Role(
                'me',
                {
                  caps: [
                    BasicCap('update')
                  ],
                  children: [
                    Role(
                      'my child',
                      {
                        caps: [
                          BasicCap('modify')
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
         Role(
          'uncle',
          {
            children: [
              Role(
                'uncles daughter',
                {
                  children: [
                    Role(
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

    RecursePath(RootRoleObject, 'grandparent', rolePath);

    expect(rolePath).to.eql(['grandparent']);

    rolePath = [];

    RecursePath(RootRoleObject, 'parent', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent']);

    rolePath = [];
    
    RecursePath(RootRoleObject, 'me', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent', 'me']);
    
    rolePath = [];

    RecursePath(RootRoleObject, 'my child', rolePath)

    expect(rolePath).to.eql(['grandparent', 'parent', 'me', 'my child']);

    rolePath = [];
    
    RecursePath(RootRoleObject, 'aunts sons son', rolePath)

    expect(rolePath).to.eql(['grandparent', 'aunt', 'aunts son', 'aunts sons son']);

    rolePath = [];

    RecursePath(RootRoleObject, 'uncles daughters daughter', rolePath)

    expect(rolePath).to.eql(['grandparent', 'uncle', 'uncles daughter', 'uncles daughters daughter']);

    rolePath = [];
    
    RecursePath(RootRoleObject, 'not found', rolePath)

    expect(rolePath).to.eql([]);

  });

});