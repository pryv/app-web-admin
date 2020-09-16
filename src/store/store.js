import Vue from 'vue';

export default Vue.observable({
  state: {
    config: {},
    currentUser: {
      username: localStorage.getItem('username') || '',
      permissions: JSON.parse(localStorage.getItem('permissions')) || [],
    },
  },
});
