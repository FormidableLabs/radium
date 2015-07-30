var allPrintStyles = {};
var listeners = [];

var addListener = function (listener) {
    var listenerIndex = listeners.indexOf(listener);

    if (listenerIndex === -1) {
        listeners.push(listener);
    }
};

var removeListener = function (listener) {
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

var addPrintStyles = function (Component) {
    if (!Component.printStyles) {
        return;
    }

    var className = `.${Component.displayName}`;
    allPrintStyles[className] = importantValues(Component.printStyles);

    // Allows for lazy loading of JS that then calls Radium to update the
    // print styles
    emitChange();
};

var getPrintStyles = function () {
    return allPrintStyles;
};

module.exports = {
    addPrintStyles,
    getPrintStyles,
    addListener,
    removeListener
};
