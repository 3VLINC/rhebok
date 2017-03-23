import { Role, IRoleParams, HasCap, ConditionalCap, IRole } from './../../index';

// Create a mock backend for testing. We'll stub this method with sinon later
export const backend = {
  getUsersRole: async () => 'logged-out'
};

// A conditional check we'll use to see if the context user is the owner of an event
const isOwnerOfEvent = async (context: EventRoleContext) => {

  return context.userId === context.eventOwnerId;

};

// Define our role type
export type EventRoleName = 'logged-out' | 'eventDirector' | 'eventManager' | 'eventOfficer';

// Define our role checking context object
export type EventRoleContext = {
  userId: number,
  eventOwnerId?: number
};

// We extend the base role, so that we enforce that the EventRole name must be of type EventRoleName
// Then we add a custom check function that can be called whatever you like.
// This method calls the `can` method of the base class to do the actual work of authorizing the user.
// This function allows us to add the EventRoleContext typeguard, so developers are aware of what values
// should be provided so that our ConditionalCaps can properly determine whether the user should be authorized.
export class EventRole extends Role implements IRole {

  constructor(name: EventRoleName, params?: IRoleParams) {

    super(name, params);

  }

  public async isAbleTo(capabilities: string | string[], context: EventRoleContext) {

    const role = await backend.getUsersRole();

    if (!role) { return false; }

    return this.can(role, capabilities, context);

  }

}

// Here we define the Role schema for the application.
// A logged-out user can only create new users (i.e. sign up)
// once they have signed up and logged in then they have different 
// capabilities depending on their role.
// An eventOfficer can view events, and edit events that they are the owner of
// An eventManager can edit all events
export const ExtendRoleSchema = new EventRole(
  'logged-out',
  {
    caps: [
      new HasCap('user:create')
    ],
    children: [
      new EventRole(
        'eventOfficer',
        {
          caps: [
            new HasCap('event:view'),
            new ConditionalCap('event:edit', { if: isOwnerOfEvent })
          ],
          children: [
            new EventRole(
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
