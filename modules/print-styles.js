/* @flow */

var allPrintStyles = {};
var listeners = [];

var addListener = function (listener: Function): void {
    var listenerIndex = listeners.indexOf(listener);

    if (listenerIndex === -1) {
        listeners.push(listener);
    }
};

var removeListener = function (listener: Function): void {
    var listenerIndex = listeners.indexOf(listener);

    if (listenerIndex > -1) {
        listeners.splice(listenerIndex, 1);
    }
};

var emitChange = function () {
    listeners.forEach(listener => listener());
};

var importantValues = function (styleObj) {
    var importantStyleObj = {};

    Object.keys(styleObj).forEach(key => {
        var value = styleObj[key];

        // This breaks unitless values but they'll be deprecated soon anyway
        // https://github.com/facebook/react/issues/1873
        value = `${value} !important`;
        importantStyleObj[key] = value;
    });

    return importantStyleObj;
};

var addPrintStyles = function (Component: constructor) {
    if (!Component.printStyles) {
        return;
    }

    var printStyleClass = {};

    Object.keys(Component.printStyles).forEach((key) => {
        var styles = Component.printStyles[key];
        var className = `Radium-${Component.displayName}-${key}`;
        allPrintStyles[`.${className}`] = importantValues(styles);
        printStyleClass[key] = className;
    });

    // Allows for lazy loading of JS that then calls Radium to update the
    // print styles
    emitChange();
    return printStyleClass;
};

var getPrintStyles = function (): Object  {
    return allPrintStyles;
};

module.exports = {
    addPrintStyles,
    getPrintStyles,
    addListener,
    removeListener
};
