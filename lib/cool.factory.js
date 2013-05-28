;(function() {

function factory(type, proto) {

    cool[type] = function (desc, extra) {
        if (this instanceof cool[type]) { return; }

        return cool[type].ctor(desc, extra);
    };

    // instanceof chain
    cool[type].prototype = new cool();

    // prototype
    cool[type].prototype.extend(
        cool.events,
        cool.store('data'),
        cool.store('params'),
        proto
    );

    // static
    cool[type].extend(
        { _type: type, _insts: {}, _ctors: {}, _events: {} }
    );
}

factory.extend({

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
        if (!name) { throw new Error('property "name" is mandatory.'); }
        if (this._ctors[name]) { throw new Error(this._type + ' "' + name + '" is already defined.'); }

        var ctor = this._ctors[ name ] = cool[this._type];
        ctor.prototype = new cool[this._type]();
        util.extend( ctor.prototype, desc );

        return cool;
    },

    create: function(name, params) {
        if (!this._ctors[ name ]) {
            throw new Error(this._type + ' "' + name + '" is not defined. Use cool.' + this._type + '({name: \'' + name + '\'}) to define it.');
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

cool._factory = factory;

})();
