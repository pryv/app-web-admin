import store from '@/store/store.js';

const getPermissions = function(permissionsGroup) {
  const permissions = store.state.currentUser.permissions;
  if (
    !permissions ||
    !permissions[permissionsGroup] ||
    !Array.isArray(permissions[permissionsGroup])
  ) {
    return [];
  }
  return permissions[permissionsGroup];
};

export class PermissionsService {
  static canReadSettings() {
    return getPermissions('settings').includes('read');
  }
  static canUpdateSettings() {
    return getPermissions('settings').includes('update');
  }
  static canReadAdminUsers() {
    return getPermissions('users').includes('read');
  }
  static canCreateAdminUsers() {
    return getPermissions('users').includes('create');
  }
  static canDeleteAdminUsers() {
    return getPermissions('users').includes('delete');
  }
  static canResetPassword() {
    return getPermissions('users').includes('resetPassword');
  }
  static canChangePermissions() {
    return getPermissions('users').includes('changePermissions');
  }
  static canReadPlatformUsers() {
    return getPermissions('platformUsers').includes('read');
  }
  static canModifyPlatformUsers() {
    return getPermissions('platformUsers').includes('modify');
  }
  static canDeletePlatformUsers() {
    return getPermissions('platformUsers').includes('delete');
  }
}
