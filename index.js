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

    /* cool.events.js begin */
;(function(){

/**
 * Events mixin
 */
var events = {

    /**
     * Listeners store
     *
     * @type Object
     */
    _events: null,

    /**
     * Event constructor
     *
     * @private
     *
     * @param {String} type
     * @param {Object} extra
     *
     * @returns Object
     */
    _event: function(type, extra) {

        var event = {
            type: type,
            owner: this
        };

        if (extra) {
            event.extend(extra);
        }

        return event;
    },

    /**
     * Adds listener for the specified event
     *
     * @param {String} type
     * @param {Function} listener
     * @param {Object} context
     *
     * @returns this
     */
    on: function(type, listener, context) {
        var events = this._events = this._events || {};

        cool.assert(typeof listener === 'function',
            'listener for %1 should be a function', type);

        if (!events[type]) { events[type] = []; }

        events[type].push({
            listener: listener,
            context: context || this
        });

        return this;
    },

    /**
     * Removes listener by event/listener/context
     *
     * @param {String} type
     * @param {Function} listener
     * @param {Object} context
     *
     * @returns this
     */
    off: function(type, listener, context) {
        var events = this._events;

        if (type) {
            events = events && events[type];
        } else {
            type = xtnd.keys(events);
        }
        if (!events) { return this; }

        xtnd.each(type, function(type) {
            events[type] = events[type].filter(function(item) {
                return !(context && context === item.context
                    || listener && listener === item.listener);
            });
        });

        return this;
    },

    /**
     * Executes each of the listeners
     *
     * @param {Object|String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        var events = this._events;

        if (typeof event === 'stings') {
            event = this._event(event);
        }

        events = events && events[event.type];

        xtnd.each(events, function(item) {
            item.listener.call(item.context, event, data);
        });

    }
};

cool.events = events;

})();

/* cool.events.js end */

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
        proto
    );

    // static
    cool[type].extend(
        factory,
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
        var ctor;
        var type = this._type;
        var ctors = this._ctors;

        cool.assert(name, 'Property "name" is mandatory.');
        cool.assert(!ctors[name], '%1 "%2" is already defined.', type, name);

        ctor = ctors[name] = function() {};
        ctor.prototype = new cool[type]();
        ctor.prototype.extend( desc );

        return cool;
    },

    create: function(name, params) {
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
