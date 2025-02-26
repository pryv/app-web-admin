/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
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
