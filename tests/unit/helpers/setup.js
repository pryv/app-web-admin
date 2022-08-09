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
