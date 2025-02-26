/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
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
