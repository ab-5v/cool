
cool._fabriq = function(TYPE, proto) {

    cool[TYPE] = function (desc, extra) {
        if (this instanceof cool[TYPE]) { return; }

        return cool[TYPE].ctor(desc, extra);
    };

    // instanceof chain
    cool[TYPE].prototype = new cool();

    // prototype
    util.extend(
        cool[TYPE].prototype,
        cool.events,
        cool.store('data'),
        cool.store('params'),
        cool.proto
    );

    // static
    util.extend(
        cool[TYPE],
        cool._fabriq,
        { _type: TYPE, _Type: TYPE.charAt(0).toUpperCase() + TYPE.slice(1) },
        { _insts: {}, _ctors: {}, _events: {} }
    );
};

util.extend(cool._fabriq, {

    ctor: function(desc, extra) {

        // view defenition
        if (typeof desc === 'object') {
            return this.define(desc.name, desc);

        // view instatntiation
        } else if (typeof desc === 'string') {
            return this.create(desc, extra || {});
        }
    },

    define: function(name, desc) {
        if (!name) { throw new Error('Property "name" is mandatory.'); }
        if (this._ctors[name]) { throw new Error(this._Type + ' "' + name + '" is already defined.'); }

        var ctor = this._ctors[ name ] = cool[this._type];
        ctor.prototype = new cool[this._type]();
        util.extend( ctor.prototype, desc );

        return cool;
    },

    create: function(name, params) {
        if (!this._ctors[ name ]) {
            throw new Error(this._Type + ' "' + name + '" is not defined. Use cool.' + this._type + '({name: \'' + name + '\'}) to define it.');
        }

        var inst = ( new this._ctors[ name ]() )._init(params);

        // ensure instances store
        if (!this._insts[ name ]) { this._insts[ name ] = []; }

        this._insts[ name ].push( inst );

        // self binding
        util.each(this._events[ name ], function(event) {
            inst.on(event.type, event.callback, event.context, event.target);
        });

        return inst;
    },

    find: function(name) {
        return this._insts[name] || [];
    },

    findOne: function(name) {
        return this.find(name)[0];
    }

});
