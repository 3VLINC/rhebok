import { Role, HasCap, ConditionalCap } from './../../index';

// A conditional check we'll use to see if the context user is the owner of an event
const isOwnerOfEvent = async (context: any) => {

  return context.userId === context.eventOwnerId;

}

// Option 1: Use Role Object Directly

// Define a hierarchy of roles and capabilities.
// This method is the simplest however you won't get any application level
// type checks in your IDE
export const SimpleRoleSchema  = new Role(
  'logged-out',
  {
    caps: [
      new HasCap('user:create')
    ],
    children: [
      new Role(
        'eventOfficer',
        {
          caps: [
            new HasCap('event:view'),
            new ConditionalCap('event:edit', { if: isOwnerOfEvent })
          ],
          children: [
            new Role(
              'eventManager',
              {
                caps: [
                  new HasCap('event:edit')
                ]
              }
            )
          ]
        }
      )
    ]
  }
);