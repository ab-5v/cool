;(function() {

function factory(type, proto) {

    cool[type] = function (desc, extra) {
        if (this instanceof cool[type]) { return; }

        return cool[type].ctor(desc, extra);
    };

    // instanceof chain
    cool[type].prototype = new cool();

    // prototype
    xtnd(cool[type].prototype, cool.events, proto);

    // static
    xtnd(cool[type],
        factory,
        { _type: type, _insts: {}, _ctors: {}, _events: {} }
    );
}

xtnd(factory, {

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
        var ctor;
        var type = this._type;
        var ctors = this._ctors;

        cool.assert(name, 'Property "name" is mandatory.');
        cool.assert(!ctors[name], '%1 "%2" is already defined.', type, name);

        ctor = ctors[name] = function() {};
        ctor.prototype = new cool[type]();
        xtnd( ctor.prototype, desc );

        return cool;
    },

    create: function(name, params) {
        /* jshint -W101 */
        var inst;
        var type = this._type;
        var ctor = this._ctors[name];
        var insts = this._insts;

        // ensure we have a ctor
        cool.assert(ctor, '%1 "%2" in not defined. Use cool.%1({name: "%2"}).', type, name);

        // creating new instance
        inst = (new ctor())._init(params);

        // ensure instances store
        if (!insts[name]) { insts[name] = []; }

        // add instance to store
        insts[name].push( inst );

        // binding events from the queue
        //xtnd.each(events[name], function(event, key) {
        //    inst.on(event.type, event.callback, event.context, event.target);
        //});

        return inst;
    }

});

cool.factory = factory;

})();
