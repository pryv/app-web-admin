import Vue from 'vue';

export default Vue.observable({
  state: {
    config: {},
    currentUser: {
      permissions: JSON.parse(localStorage.getItem('permissions')) || [],
    },
  },
});
