/**
 * @license
 * Copyright (C) 2020–2024 Pryv S.A. https://pryv.com - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
class LocalStorageMock {
  constructor () {
    this.store = {
      username: 'testuser'
    };
  }

  clear () {
    this.store = {};
  }

  getItem (key) {
    return this.store[key] || null;
  }

  setItem (key, value) {
    this.store[key] = value.toString();
  }

  removeItem (key) {
    delete this.store[key];
  }
}
global.localStorage = new LocalStorageMock();
