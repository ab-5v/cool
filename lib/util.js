var util = {
    keys: Object.keys,
    args: function(args, from) {
        return Array.prototype.slice.call(args, from || 0);
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
        } else {
            util.each(util.array(obj), callback);
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

    isArray: function(arr) {
        return arr instanceof Array;
    },

    toArray: function(obj) {
        if (!obj) {
            return [];
        } else {
            return [].concat(obj);
        }
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
