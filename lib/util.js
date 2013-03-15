var util = cool.util = {
    keys: Object.keys,
    extend: function(dest) {
        Array.prototype.slice.call(arguments, 1)
            .forEach(function(src) {
                util.keys(src).forEach(function(key) {
                    dest[key] = src[key];
                });
            });
        return dest;
    }
};
