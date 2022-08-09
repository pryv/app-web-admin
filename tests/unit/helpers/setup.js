/**
 * @license
 * [BSD-3-Clause](https://github.com/pryv/app-web-admin/blob/master/LICENSE)
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
