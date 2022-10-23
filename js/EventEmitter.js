class EventEmitter {
  #listeners = {};

  emit(method, payload = null) {
    const callback = this.#listeners[method];

    if (typeof callback === 'function') {
      callback(payload);
    }
  }

  on(method, callback) {
    this.#listeners[method] = callback;
  }

  off(method) {
    delete this.#listeners[method];
  }

  removeAllListeners() {
    this.#listeners = {};
  }
}
