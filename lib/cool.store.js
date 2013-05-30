;(function() {

var store = function(name) {
    var mixin = {};

    mixin[name] = function(val) {
        var prop = '_' + name;

        if (arguments.length) {
            this['_' + name] = val;
        } else {
            return this['_' + name];
        }
    };

    return mixin;
};

cool.store = store;

})();
