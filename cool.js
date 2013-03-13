;(function(root) {

var view, model;
var cool = root.cool = {};

cool.util = {
    keys: Object.keys
};

cool._class = function(parent, proto) {
    proto = proto || {};

    var _class = function(options) {
        return new proto._init(options);
    };

    _class.prototype = proto;

    proto._init.prototype = proto;
};

cool.core = cool._class();



cool._view = cool._class(cool.core, {
});

cool.view = function(options) {
    return cool._class(cool._view, options);
};
cool.view.overwrite = function(options) {
    for (var key in options) {
        cool._view.prototype[key] = options[key];
    }
};


})(this, undefined);
