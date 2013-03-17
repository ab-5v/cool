var util = {
    keys: Object.keys,
    args: function(args, from) {
        return Array.prototype.slice.call(args, from || 0);
    },
    array: function(val) {
        return [].concat(val);
    },
    extend: function(dest) {
        util.args(arguments, 1).forEach(function(src) {
            util.keys(src).forEach(function(key) {
                dest[key] = src[key];
            });
        });
        return dest;
    },
    klass: function(parent, extra) {
        var child = function() {};
        child.prototype = new parent();
        cool.util.extend(child.prototype, extra);
        return child;
    }
};
