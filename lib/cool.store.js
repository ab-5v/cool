;(function() {

var store = function(name) {
    var mixin = {};

    mixin[name] = function(val) {
        var prop = '_' + name;

        if (arguments.length) {
            this[prop] = val;
        } else {
            return this[prop];
        }
    };

    return mixin;
};

cool.store = store;

})();
