/* @flow */

import appendImportantToEachValue from './append-important-to-each-value';

const allPrintStyles = {};
const listeners = [];

function subscribe(listener: () => void): {remove: () => void} {
  if (listeners.indexOf(listener) === -1) {
    listeners.push(listener);
  }

  return {
    remove: function() {
      const listenerIndex = listeners.indexOf(listener);

      if (listenerIndex > -1) {
        listeners.splice(listenerIndex, 1);
      }
    }
  };
}

function _emitChange() {
  listeners.forEach(listener => listener());
}

function addPrintStyles(Component: constructor) {
  if (!Component.printStyles) {
    return;
  }

  const printStyleClass = {};

  Object.keys(Component.printStyles).forEach(key => {
    const styles = Component.printStyles[key];
    const className = `Radium-${Component.displayName}-${key}`;
    allPrintStyles[`.${className}`] = appendImportantToEachValue(styles);
    printStyleClass[key] = className;
  });

  // Allows for lazy loading of JS that then calls Radium to update the
  // print styles
  _emitChange();
  return printStyleClass;
}

function getPrintStyles(): Object  {
  return allPrintStyles;
}

export default {
  addPrintStyles,
  getPrintStyles,
  subscribe
};
