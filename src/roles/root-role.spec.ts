import { expect } from '../utils/test';
import { RootRole } from './root-role';
import { Role } from './role';
import { DuplicateRoleNameError } from './utils/errors';

describe('RootRole', () => {

  describe('when no duplicate role is found', () => {

    it('should instantiate without error.', () => {

      const init = () => new RootRole('root', {
        children: [
          new Role('child', {
            children: [
              new Role('grandchildren')
            ]
          })
        ]
      });

      expect(() => init()).not.to.throw();

    })

  });

  describe('when aduplicate role is found', () => {

    it('should throw a duplicate role error.', () => {

      const init = () => new RootRole('root', {
        children: [
          new Role('child', {
            children: [
              new Role('child')
            ]
          })
        ]
      });

      expect(() => init()).throw(DuplicateRoleNameError);

    })

  });

});