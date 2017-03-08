/* @flow */

export default class StyleKeeper {
  _userAgent: string;
  _listeners: Array<() => void>;
  _cssSet: {[id: string]: bool};

  constructor(userAgent: string) {
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

  // React PropType validator function
  static isStyleKeeper(props, propName, componentName) {
    const msg = [
      `Invalid prop ${propName} supplied to ${componentName}.`,
      'Must be an instance of radium.StyleKeeper'
    ].join(' ');

    const requiredShape = {
      subscribe: 'function',
      addCSS: 'function',
      getCSS: 'function',
      _emitChange: 'function'
    };

    const shape = props[propName];

    if (!Object.keys(requiredShape).every(key => {
      // console.warn(key, typeof shape[key], requiredShape[key]);
      return typeof shape[key] === requiredShape[key];
    })) {
      // console.error(shape, requiredShape)
      throw new Error(msg);
    }
  }
}
