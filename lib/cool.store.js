;(function() {

var store = function(name) {
    var mixin = {};

    /**
     * Adds support of data manipulations
     * for specified `name` with API:
     *  data()
     *  data(name)
     *  data(name, value)
     *  data({})
     *  data(true, {})
     *  data(true, name, value)
     *  data(false)
     *  data(false, name)
     *  data(false, name, value)
     *
     * Returns data for getters
     * changes object for setters
     */
    mixin[name] = cool.method(name, function() {
        var keys, before, after;
        var args = arguments;
        var data = this['_' + name];
        var len = args.length;
        var arg = args[0];
        var typ = typeof arg;

        // getters
        if (!len) {
            return data;
        } else if (len === 1 && typ === 'string') {
            return data[ arg ];
        }

        // setters
        keys = store.keys(args, data, typ);

        before = store.collect(this['_' + name], keys);

        if (len > 3) {
            store.wrong(name, args);
        } else if (len === 1) {

            // data({})
            if (typ === 'object') {
                this['_' + name] = arg;
            // data(false)
            } else if (arg === false) {
                this['_' + name] = {};
            } else {
                store.wrong(name, args);
            }
        } else if (typ === 'string' && len === 2) {
            // data(name, value)
            data[arg] = args[1];

        } else if (arg === false) {
            if (typeof args[1] === 'string') {
                // data(false, name)
                if (len === 2) {
                    delete data[args[1]];
                // data(false, name, value)
                } else {
                    data[args[1]] = xtnd.filter( data[args[1]], function(v) {
                        return args[2] != v;
                    });
                }
            } else {
                store.wrong(name, args);
            }
        } else if (arg === true) {

            if (len === 2 && typeof args[1] === 'object') {
                xtnd(data, args[1]);
            } else if (typeof args[1] === 'string') {
                data[args[1]] = xtnd.array(data[args[1]]).concat(args[2]);
            }
        }

        after = store.collect(this['_' + name], keys);

        return {
            before: before,
            after: after
        };
    // silent
    }, function(arg) {
        var len = arguments.length;
        return !len || len === 1 && typeof arg === 'string';
    });

    return mixin;
};

xtnd(store, {

    /**
     * Genereates keys to be changed
     *
     * @param {Array} args
     * @param {Object} data
     * @param {String} typ
     *
     * @returns Array
     */
    keys: function(args, data, typ) {
        var keys, len = args.length;

        // data({})
        if (typ === 'object') {
            keys = xtnd.keys(data).concat( xtnd.keys(args[0]) );
        } else if ( typ === 'boolean') {
            if (len === 1) {
                // data(false)
                keys = xtnd.keys(data);
            } else {
                // data(true, {})
                // data(true, name), data(true, name, value)
                // data(false, name), data(false, name, value)
                keys = typeof args[1] === 'object' ?
                    xtnd.keys(args[1]) : [args[1]];
            }
        } else {
            // data(name, value)
            keys = [ args[0] ];
        }

        return keys;
    },

    /**
     * Collects values for given keys
     *
     * @param {Object} data
     * @param {Array} keys
     *
     * @returns Object
     */
    collect: function(data, keys) {
        return xtnd.map(data, function(val, key) {
            return keys.indexOf(key) > -1 ?
                val : undefined;
        });
    },

    /**
     * Generates error for wrong format
     *
     * @param {String} name
     * @param {Array} args
     */
    wrong: function(name, args) {
        var msg = 'unsupported arguments for %1(%2)';
        var str = xtnd.array(args).join(', ');

        cool.assert(false, msg, name, str);
    }
});

cool.store = store;

})();
