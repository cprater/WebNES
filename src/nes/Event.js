export class Event {
  constructor() {
    this._callbacks = [];
  }

  addCallback(cb) {
    this._callbacks.push(cb);
  }

  invoke() {
    const eventArgs = Array.prototype.slice.call(arguments, 0);
    for (let i = 0; i < this._callbacks.length; ++i) {
      this._callbacks[i].apply(this, eventArgs);
    }
  }
}

export class EventBus {
  constructor() {
    this._map = {};
  }

  getEvent(name) {
    if (!this._map[name]) {
      this._map[name] = new Event();
    }
    return this._map[name];
  }

  connect(name, cb) {
    this.getEvent(name).addCallback(cb);
  }

  invoke(name) {
    const event = this._map[name];
    let eventArgs = [];

    if (event) {
      if (arguments.length > 1) {
        eventArgs = Array.prototype.slice.call(arguments, 1);
      }

      event.invoke.apply(event, eventArgs);
    }
  }
}
