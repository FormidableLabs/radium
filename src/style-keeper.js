/* @flow */

export default class StyleKeeper {
  _userAgent: string | typeof undefined;
  _listeners: Array<() => void>;
  _cssSet: {[id: string]: boolean};

  constructor(userAgent?: string) {
    this._userAgent = userAgent;
    this._listeners = [];
    this._cssSet = {};
  }

  subscribe(listener: () => void): {remove: () => void} {
    if (this._listeners.indexOf(listener) === -1) {
      this._listeners.push(listener);
    }

    return {
      // Must be fat arrow to capture `this`
      remove: () => {
        const listenerIndex = this._listeners.indexOf(listener);
        if (listenerIndex > -1) {
          this._listeners.splice(listenerIndex, 1);
        }
      }
    };
  }

  addCSS(css: string): {remove: () => void} {
    if (!this._cssSet[css]) {
      this._cssSet[css] = true;
      this._emitChange();
    }

    return {
      // Must be fat arrow to capture `this`
      remove: () => {
        delete this._cssSet[css];
        this._emitChange();
      }
    };
  }

  getCSS(): string {
    return Object.keys(this._cssSet).join('\n');
  }

  _emitChange() {
    this._listeners.forEach(listener => listener());
  }
}
