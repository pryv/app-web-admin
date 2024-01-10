/**
 * @license
 * Copyright (C) 2020–2024 Pryv S.A. https://pryv.com - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
export const handleInvalidTokenError = function (error, vueComponent) {
  if (error && error.response) {
    if (
      error.response.status === 401 &&
      error.response.data.error.message === 'Invalid token'
    ) {
      localStorage.removeItem('token');
      vueComponent.$emit('loggedOut');
      vueComponent.$router.push('/login');
      return true;
    } else {
      return false;
    }
  }
};
