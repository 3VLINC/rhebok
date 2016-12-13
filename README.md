# Rhebok - A hierarchical, asynchronous role based access control (RBAC) module 

[![Build Status](https://travis-ci.org/3VLINC/rhebok.svg)](https://travis-ci.org/3VLINC/rhebok)

## Overview

This module works by defining a hierarchy of roles and capabilities and checking to see if a role possesses a certain capability. This allows you to determine whether a user should have access to a given resource or operation. The module is written in Typescript and compiles to commonjs.

This module is in beta. The API could change prior to 1.0 release.

## Install
```txt
npm install rhebok
```

## Objects

### Role
Accepts name and params.

**Important**
The Role name must be unique within your role hierarchy. To ensure that you haven't used a role name twice, you can chain the `validate()` method to the end of your topmost role. This will run a recursive check and throw an error if a duplicate role name has been found. While you do not have to call this method, keep in mind that accidentally re-using a role name could result in a user gaining elevated access.
```
const SimpleRoleSchema = new Role(
	 'logged-out',
	{
	    caps: [
	      new HasCap('user:create')
	    ],
	    children: [
		    new Role(
			    'logged-in',
			    {
				    caps: [
					    new HasCap('event:create'),
					    new ConditionalCap(
						    'event:update',
						    {
							    if: async (context: any) => {
									return (context.eventOwnerId === context.userId);
								}
							}
					    )
				    ]
				}
			)
		]
	}
 ).validate();
```
####Methods
#####Can
Accepts a role name, capability name and a context object. The context object is passed into any `ConditionalCap` to help it decide if the role should pass the capability check. This method returns a promise which resolves to true if the role has the capability.

```
SimpleRoleSchema.can(
	'logged-in',
	'event:update', 
	{ 
		userId: 5, 
		eventOwnerId: 6
	}
);
```
### HasCap

Accepts name. If a role has this capability then the role is deemed to be authorized.
```
new HasCap('event:create')
```

### ConditionalCap
Accepts a name and params. If a role has this capability, then the function assigned to the `if` attribute of params is called. The `if` function should return a promise. If that promise resolves with true, then the role is deemed authorized.

```
new ConditionalCap(
    'event:update',
    {
	    if: async (context: any) => {
			return (context.eventOwnerId === context.userId);
		}
	}
)
```


## Extending Roles and Capabilities

### Extending Roles

You may wish to extend the Role object in your application with a thin wrapper. This will provide two benefits:

 1. You can use types for your roles and the context parameter which gives you the benefits of type checking in Typescript.
 2. You can encapsulate logic for asynchronously retrieving a users role. This is especially helpful when the users role depends on the authorization context (i.e. the users role depends on the particular object they are trying to access).

#### Example
```
import { Role, RoleParams, HasCap, ConditionalCap } from 'rhebok';

// Define our role type
export type EventRoleName = 'logged-out' | 'eventManager' | 'eventOfficer';

// Define our role checking context object
export type EventRoleContext = {
  userId: number,
  eventId?: number
};

// A conditional check we'll use to see if the context user is the owner of an event
const isOwnerOfEvent = async (context: EventRoleContext) => {

	//Do something asynchronous to get the event object
	const event = await backend.getEvent(context.eventId);
	
	return context.userId === event.eventOwnerId;

}

class EventRole extends Role {

  constructor(name: EventRoleName, params?: RoleParams) {

    super(name, params);

  }

  public async isAbleTo(capabilities: string | string[], context: EventRoleContext) {

	// Do something asynchronous
    const role = await backend.getUsersRoleOnEvent(context.userId, context.eventId);

    return this.can(role, capabilities, context);

  }

}

export const RoleSchema = new EventRole(
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

const can = await RoleSchema.isAbleTo('event:edit', { userId: 5, eventId: 5});

if (!can) { throw new Error('Can\'t touch this!'); }
```

### Extending Capabilities
You can import the abstract class `Cap` from the package and create your own custom capability objects.

```
import { Cap } from 'rhebok';

export class MyCustomCap extends Cap {

    public async check(context?: any) {

        if (context.isEmergency === true || context.color === 'green') { return true; }

        return false;

    }

}

const role = new Role(
        'driver',
        {
            caps: [
                new MyCustomCap('go-through-light')
            ]
        }
    );

const can = await role.can('driver', 'go-through-light', { color: 'red', isEmergency: true })

if (!can) { throw new Error('You must stop.'); }
```