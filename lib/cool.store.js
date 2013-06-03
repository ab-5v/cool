;(function() {

var store = function(name) {
    var mixin = {};

    mixin[name] = function() {
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
        keys = store.keys(args, typ);

        before = store.collect(data, keys);

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
    };

    return mixin;
};

xtnd(store, {
    keys: function(args, typ) {
        var keys = args[ typ === 'boolean' ? 1 : 0 ];

        return typeof keys === 'object' ?
            xtnd.keys(keys) : [keys];
    },
    collect: function(data, keys) {
        return xtnd.map(data, function(v, key) {
            return keys.indexOf(key) > -1;
        });
    },
    wrong: function(name, args) {
        var msg = 'unsupported argumetns for %1(%2)';
        var str = xtnd.array(args).join(', ');

        cool.assert(false, msg, name, str);
    }
});

cool.store = store;

})();
