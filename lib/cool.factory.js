;(function() {

function factory(type, proto) {

    cool[type] = function (desc, params, data) {
        if (this instanceof cool[type]) { return; }

        return cool[type].ctor(desc, params, data);
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
        inst = new ctor();

        // binding events
        events[type](inst);

        // initializing
        inst.init(params, data);

        // ensure instances store
        if (!insts[name]) { insts[name] = []; }

        // add instance to store
        insts[name].push( inst );

        return inst;
    }

});

cool.factory = factory;

var events = {

    re: /^(?:(.+?)\s*->\s*)?([^\s]+)(?:\s+(.*))?$/,

    /**
     * Parses event descriptions, which could be:
     * @example
     *
     *           submit
     *  form  -> submit
     *           append
     *  view  -> append
     *  view  -> append subview
     *  model -> fetch
     *
     * @param {String} desc
     *
     * @returns Object
     */
    info: function(desc) {
        var info = {};
        var match = desc.match(this.re);

        cool.assert(match, 'wrong event format %1', desc);

        info.type = match[2];

        if (info.type in events.DOM) {
            info.kind = 'dom';
        } else if (info.type in cool.model.EVENTS) {
            info.kind = 'model';
        } else {
            info.kind = 'view';
        }

        info.slave = match[3] || info.kind === 'view' && '*' || '';
        info.master = match[1] || 'this';
        info.context = info.kind === 'dom' ? 'this' : '';


        return info;
    },

    /**
     * Initialize events for the view
     *
     * @param {cool.view} view
     */
    view: function(view) {
        view.events = view.events || {};

        var parsed = events.parse(view);

        view.one('rendered', function() {
            events.dom(view, parsed);
        });

        events.on(view, parsed);
        events.restore(view, 'view');
    },

    /**
     * Binds events from queue for model
     *
     * @param {cool.model} view
     */
    model: function(model) {
        events.restore(model, 'model');
    },

    /**
     * Parses user's defined events
     *
     * @param {cool.view} view
     */
    parse: function(view) {
        var parsed = [];

        xtnd.each(view.events, function(listener, desc) {
            desc = events.info(desc);
            listener = typeof listener === 'function' ?
                listener : view[listener];

            cool.assert(typeof listener === 'function',
                'listener for "%1" should be a function', desc.type);

            listener = listener.bind(view);

            parsed.push({
                type: desc.type,
                owner: desc.owner,
                target: desc.target,
                listener: listener
            });
        });

        return parsed;
    },

    /**
     * Stores custom events for instances
     * which will be created later
     *
     * @param {cool.view} view
     * @param {Array} parsed
     */
    on: function(view, parsed) {

        xtnd.each(parsed, function(info) {
            if (!(/view|model/).test(info.kind)) { return; }

            var store = cool[info.kind]._insts;
            var queue = cool[info.kind]._events;

            if (!queue[ info.type ]) {
                queue[ info.type ] = [];
            }

            // TODO: anybody subscribed to init will miss it
            // while event binding is inside init
            if (info.master === 'this') {
                view.on(info.type, info.listener, view, info.slave);
            } else {

                // bind to existing views
                xtnd.each(store, function(inst) {
                    inst.on(info.type, info.listener, info.context, info.slave);
                });

                // add to queue for upcoming views
                queue.push({
                    type: info.type,
                    slave: info.slave,
                    context: view,
                    listener: info.listener
                });

            }

        });
        return view;
    },

    /**
     * Restores all events from queue
     * and binds them to current instance
     *
     * @param {cool} inst
     * @param {String} kind
     */
    restore: function(inst, kind) {
        var queue = cool[kind]._events;

        xtnd.each(queue[ inst.name ], function(evt) {
            inst.on(evt.type, evt.listener, evt.context, evt.slave);
        });
    },

    /**
     * Unbinds custom events
     *
     * @param {cool.view} view
     */
    off: function(view) {
        return view;
    },

    /**
     * Binds dom events
     *
     * @param {cool.view} view
     * @param {Array} parsed
     */
    dom: function(view, parsed) {

        xtnd.each(parsed, function(info) {
            if (info.kind !== 'dom') { return; }

            if (info.master === 'this') {
                view.el.on(info.type, info.listener);
            } else {
                view.el.on(info.type, info.master, info.listener);
            }
        });
    },

    DOM: xtnd.hash([
        'blur',
        'change',
        'click',
        'dblclick',
        'dragstart',
        'dragenter',
        'dragover',
        'dragleave',
        'drag',
        'drop',
        'dragend',
        'focus',
        'focusin',
        'focusout',
        'keydown',
        'keypress',
        'keyup',
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'resize',
        'scroll',
        'submit'
    ])

};

cool.factory.events = events;

})();
