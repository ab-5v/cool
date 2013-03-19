var util = {
    keys: Object.keys,
    args: function(args, from) {
        return Array.prototype.slice.call(args, from || 0);
    },
    isArray: function(arr) {
        return arr instanceof Array;
    },
    array: function(val) {
        return [].concat(val);
    },
    each: function(obj, callback) {
        if (!obj) { return; }

        if (util.isArray(obj)) {
            obj.forEach(callback);

        } else if (typeof obj === 'object') {
            util.keys(obj).forEach(function(key) {
                callback(obj[key], key, obj);
            });
        }

    },
    extend: function(dest) {
        util.args(arguments, 1).forEach(function(src) {
            util.keys(src).forEach(function(key) {
                dest[key] = src[key];
            });
        });
        return dest;
    },
    toObject: function(arr) {
        var res = {};
        arr.forEach(function(val) {
            res[val] = 1;
        });
        return res;
    },
    klass: function(parent, extra) {
        var child = function() {};
        child.prototype = new parent();
        cool.util.extend(child.prototype, extra);
        return child;
    }
};
