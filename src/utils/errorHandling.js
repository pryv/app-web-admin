export const handleHttpErrors = function(error, vueComponent) {
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
