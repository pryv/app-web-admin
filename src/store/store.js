/**
 * @license
 * [BSD-3-Clause](https://github.com/pryv/app-web-admin/blob/master/LICENSE)
 */
import Vue from 'vue';

export default Vue.observable({
  state: {
    config: {},
    currentUser: {
      username: localStorage.getItem('username') || '',
      permissions: JSON.parse(localStorage.getItem('permissions')) || []
    }
  }
});
