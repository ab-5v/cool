cool._class = function(parent, proto) {
    proto = proto || {};

    var _class = function(options) {
        return new proto._init(options);
    };

    _class.prototype = proto;

    proto._init.prototype = proto;
};

core = cool._class();
