/**
 * @license
 * Copyright (C) 2020–2024 Pryv S.A. https://pryv.com - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
