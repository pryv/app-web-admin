const getPermissions = function(permissionsGroup) {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
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
  static canReadUsers() {
    return getPermissions('users').includes('read');
  }
  static canCreateUsers() {
    return getPermissions('users').includes('create');
  }
  static canDeleteUsers() {
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
  static canDeletePlatformUsers() {
    return getPermissions('platformUsers').includes('delete');
  }
}
