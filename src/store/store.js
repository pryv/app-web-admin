/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
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
