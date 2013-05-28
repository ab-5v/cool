;(function(root) {
    var cool = function() {};

    /* cool.assert.js begin */
;(function(cool) {

var assert = function(cond, msg) {
    if (cond) { return; }

    var args = xtnd.array(arguments).slice(2);

    throw new Error( cool.assert.msg(msg, args) );
};

assert.re = /(%(\d))/g;

assert.msg = function(msg, args) {
    msg = msg || 'unknown error';

    msg = msg.replace(assert.re, function(a, b, index) {
        return args[index - 1];
    });

    msg = msg.charAt(0).toUpperCase() + msg.substr(1);

    return msg;
};

cool.assert = assert;

})(cool);

/* cool.assert.js end */

    /* cool.factory.js begin */
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

/* cool.factory.js end */

    /* cool.method.js begin */
cool.method = function(name, action) {

    return function() {
        var reply;
        var that = this;
        var args = xtnd.array(arguments);
        var event = cool.event();
        var executed = false;

        action = function() {
            if (!executed) {
                reply = action.apply(that, args);
                executed = true;
            }

            return reply;
        };

        event.extend({
            name: name,
            owner: this,
            action: action
        });

        this.trigger(event);

        if (event._prevented) { return; }

        reply = action();
        event.name = name + 'ed';

        if (pzero.is(reply)) {
            reply.then(function(data) {
                this.trigger(event, data);
            });
        } else {
            this.trigger(event, reply);
        }

        return reply;
    };
};

/* cool.method.js end */


    root.cool = cool;
})(this);
