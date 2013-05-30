;(function(root) {
    var cool = function() {};

    cool.promise = pzero;

    /* cool.store.js begin */
;(function() {

var store = function(name) {
    var mixin = {};

    mixin[name] = function(val) {
        var prop = '_' + name;

        if (arguments.length) {
            this[prop] = val;
        } else {
            return this[prop];
        }
    };

    return mixin;
};

cool.store = store;

})();

/* cool.store.js end */

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
    _events: undefined,

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
            owner: this,

           _prevented: false,
            preventDefault: preventDefault
        };

        xtnd(event, extra);

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
            events = events && events[type] && events;
        } else {
            type = xtnd.keys(events);
        }
        if (!events) { return this; }

        xtnd.each(type, function(type) {
            events[type] = events[type].filter(function(item) {
                /* jshint -W014 */
                /* jshint -W101 */
                return !(context && !listener && context === item.context
                    || listener && !context && listener === item.listener
                    || context && listener && listener === item.listener && context === item.context
                    || !listener && !context);
            });
        });

        return this;
    },

    /**
     * Adds listener for specified event
     * and removes it after first execution
     *
     * @param {String} type
     * @param {Function} listener
     * @param {Object} context
     */
    one: function(type, listener, context) {
        var that = this;

        cool.assert(typeof listener === 'function',
            'listener for %1 should be a function', type);

        var proxy = function() {
            listener.apply(this, arguments);
            that.off(type, proxy, context);
        };

        this.on(type, proxy, context);

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

        if (typeof event === 'string') {
            event = this._event(event);
        }

        events = events && events[event.type];

        xtnd.each(events, function(item) {
            item.listener.call(item.context, event, data);
        });

    }
};

cool.events = events;

function preventDefault() {
    this._prevented = true;
}

})();

/* cool.events.js end */

    /* cool.method.js begin */
;(function() {


var method = function(name, action) {

    if ( xtnd.isObject(name) ) {
        return method.extend(name, action);
    }

    return function() {
        var reply, event, binded;
        var that = this;
        var args = xtnd.array(arguments);

        binded = method.bindAction(action, this, args);
        event = this._event(name, {action: binded});

        this.emit(event);

        if (event._prevented) { return; }

        reply = binded();
        event = this._event(name + 'ed');

        if (cool.promise.is(reply)) {
            reply.then(function(data) {
                that.emit(event, data);
            });
        } else {
            this.emit(event, reply);
        }

        return reply;
    };
};

/**
 * Creates ready for execution action
 * with multiexecution protections
 *
 * @param {Function} action
 * @param {Object} context
 * @param {Array} args
 *
 * @returns Function
 */
method.bindAction = function(action, context, args) {
    var reply, resolved = false;

    return function() {
        if (!resolved) {
            reply = action.apply(context, args);
            resolved = true;
        }

        return reply;
    };
};

/**
 * Binds set of methods to destination object
 *
 * @param {Object} dest
 * @param {Object} props
 *
 * @returns Object
 */
method.extend = function(dest, props) {

    xtnd.each(props, function(action, name) {
        dest[name] = method(name, action);
    });

    return dest;
};

cool.method = method;

})();

/* cool.method.js end */

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
    xtnd(cool[type].prototype, cool.events, proto);

    // static
    xtnd(cool[type],
        factory,
        { _type: type, _insts: {}, _ctors: {}, _events: {} }
    );
}

xtnd(factory, {

    ctor: function(desc, params, data) {

        // view defenition
        if (typeof desc === 'object') {
            return this.define(desc.name, desc);

        // view instatntiation
        } else if (typeof desc === 'string') {
            data = data || {};
            params = params || {};

            return this.create(desc, params, data);
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

    create: function(name, params, data) {
        /* jshint -W101 */
        var inst;
        var type = this._type;
        var ctor = this._ctors[name];
        var insts = this._insts;

        // ensure we have a ctor
        cool.assert(ctor, '%1 "%2" in not defined. Use cool.%1({name: "%2"}).', type, name);

        // creating new instance
        inst = (new ctor()).init(params, data);

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


    xtnd(cool.prototype,
        cool.events,
        cool.store('data'),
        cool.store('params')
    );

    /* cool.view.js begin */
;(function() {

cool.factory('view', {

    /**
     * Returns all the data and params
     *
     * @returns Object
     */
    toJSON: function() {
        return {
            data: this.data(),
            params: this.params()
        };
    },

    /**
     * Renders HTML string
     *
     * @param {Object} json
     *
     * @return String
     */
    html: function(json) {
        return '<h1>' + json.params.name + '</h1>';
    },

    append: function(child) {
        this.trigger('append', child);
    }
});

cool.method(cool.view.prototype, {

    /**
     * Initializes view
     * Requests all models and renders html
     *
     * @private
     * @param {Object} params for models request
     * @param {Object} data for template rendering
     */
    init: function(params, data) {
        var that = this;

        that.data(data);
        that.params(params);

        init.models(that)
            .then(function() {
                that.render();
            });

        init.views(that);

        return this;
    },

    render: function() {

        var json = this.toJSON();
        var html = this.html( json );
        var el = $( html ).eq(0);

        if (this.el) {
            this.el.html( el.html() );
        } else {
            this.el = el;
        }
    }

});

var init = {

    views: function(that) {
        var views = {};

        xtnd.each(that.views, function(name) {
            views[name] = cool.view(name, that.params);
            views[name].one('rendered', function() {
                that.append(this);
            });
        });
    },

    models: function(that) {
        var models = {};

        var fetches = xtnd.map(that.models, function(name) {
            models[name] = that.model(name, that.params);
            return models[name].fetch();
        });

        that.models = models;

        return cool.promise.when(fetches);
    },

    re: /^(?:([^. ]+)\.)?([^. ]+)(?:\s(.*))?$/,

    /**
     * Parses event descriptions, which could be:
     * @example
     *
     *  click .selector
     *  append view
     *  view.append view
     *  model.read
     *
     * @param {String} desc
     *
     * @returns Object
     */
    info: function(desc) {
        var info = {};
        var match = desc.match(this.re);

        cool.assert(match, 'wrong event format %1', desc);

        if (match[2]) { info.type = match[2]; }
        if (match[1]) { info.owner = match[1]; }
        if (match[3]) { info.target = match[3]; }

        return info;
    }

};

cool.view.init = init;

})();

/* cool.view.js end */

    /* cool.model.js begin */
;(function() {

cool.factory('model', {});

cool.method(cool.model.prototype, {

    init: function(data, params) {

        cool.assert(this.url, 'you should specify url for model %1', this.name);

        this.data(data);
        this.params(params);
    },

    fetch: function() {
        var url = this.url;
        var type = 'get';
        var params = this.params();
        var promise = cool.promise();

        $.ajax({
            url: url,
            traditional: true,
            type: type,
            data: params,
            context: this,
            dataType: 'json',
            success: function(data) {
                this.data(data);
                promise.resolve(this);
            }
        });

        return promise;
    }

});

})();

/* cool.model.js end */


    root.cool = cool;
})(this);
