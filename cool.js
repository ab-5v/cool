;(function(root) {

var util = {
    keys: Object.keys,
    args: function(args, from) {
        return Array.prototype.slice.call(args, from || 0);
    },
    isArray: function(arr) {
        return arr instanceof Array;
    },
    array: function(val) {
        return [].concat(val);
    },
    each: function(obj, callback) {
        if (!obj) { return; }

        if (util.isArray(obj)) {
            obj.forEach(callback);

        } else if (typeof obj === 'object') {
            util.keys(obj).forEach(function(key) {
                callback(obj[key], key, obj);
            });
        }

    },
    extend: function(dest) {
        util.args(arguments, 1).forEach(function(src) {
            util.keys(src).forEach(function(key) {
                dest[key] = src[key];
            });
        });
        return dest;
    },
    toObject: function(arr) {
        var res = {};
        arr.forEach(function(val) {
            res[val] = 1;
        });
        return res;
    },
    klass: function(parent, extra) {
        var child = function() {};
        child.prototype = new parent();
        cool.util.extend(child.prototype, extra);
        return child;
    }
};


var cool = root.cool = function() {};

cool.util = util;

cool.promise = pzero;

cool.events = {

    on: function(type, callback, context) {
        var events = this._customevents = this._customevents || {};

        if (!events[type]) { events[type] = []; }

        events[type].push({
            callback: callback,
            context: context || this
        });

        return this;
    },

    trigger: function(type, data) {
        var event = { owner: this };
        var events = this._customevents;

        if (typeof type === 'string') {
            util.extend(event, {type: type});
        } else if (typeof type === 'object') {
            util.extend(event, type);
            type = event.type;
        }

        util.each(events && events[type], function(item) {
            item.callback.call(item.context, event, data);
        });
    }
};

;(function() {

var init = {
    _init: function(data) {
        var that = this;

        this.promise = cool.promise();
        this.data = data;
        this._param = {};

        // reorgonize events
        this._events();

        this._models()
            .then(this._element.bind(this))
            .then(this._views.bind(this))
            .then(function() {
                that.init(that.data);
                return that;
            });

        return this;
    },

    _eventre: /^([^. ]+)(?:\.([^. ]+))?(?:\s(.*))?$/,
    _eventinfo: function(event) {
        var info = {};
        var match = event.match(this._eventre);
        if (match) {
            if (match[1]) { info.type = match[1]; }
            if (match[2]) { info.owner = match[2]; }
            if (match[3]) { info.target = match[3]; }
        } else {
            throw new Error('Wrong event format "' + event + '".');
        }

        return info;
    },

    _eventon: function(event, callback, type) {
        console.log('_eventon', this.name, type);
        var that = this;
        var statik = cool[type];
        var events = statik._events;

        // future views
        if (!events[ event.owner ]) {
            events[ event.owner ] = [];
        }
        events[ event.owner ].push( {type: event.type, callback: callback, context: that} );

        // existing views
        util.each(statik._inst[ event.owner ], function(inst) {
            inst.on(event.type, callback, that);
        });

    },

    _events: function() {
        var that = this;
        this._domevents = [];

        util.each(this.events, function(callback, key) {
            callback = that[ callback ];

            var event = that._eventinfo(key);

            // dom event
            if (!event.owner) {
                that._domevents.push({
                    type: event.type,
                    selector: event.target,
                    callback: callback
                });

            // model events
            } else if (event.type in cool.model.EVENTS) {
                that._eventon(event, callback, 'model');
            // view events
            } else {
                that._eventon(event, callback, 'view');

            }

        });
    },

    _models: function() {
        var that = this;
        var models = this.models;

        this.models = {};

        // init models
        var reads = util.array(models).map(function(name) {
            var model = cool.model(name);
            that.models[name] = model;

            return model.read();
        });

        return cool.promise.when(reads).then(function(models) {
            models.forEach(function(model) {
                that.data[model.name] = model.data();
            });
        });

    },

    _element: function() {
        var that = this;

        // ensure element
        this.el = that.render(this.data);

        // init events
        util.each(this._domevents, function(event) {
            that.el.on(event.type, event.selector, event.callback.bind(that));
        });

    },

    _views: function() {
        var that = this;
        var views = this.views;

        this.views = {};

        // init views
        views = views.map(function(name) {
            var view = cool.view(name);
            that.views[name] = view;
            return view.promise;
        });


        // append views when they are ready
        return cool.promise.when(views).then(function(views) {
            views.forEach(function(view) {
                that.append(view);
            });

            that.promise.resolve(that);
        });
    }
};

var proto = {
    views: [],
    models: [],
    events: {},

    init: function() {},

    render: function(data) {
        return $('<div/>').html( yr.run('main', this.data, 'cool-' + this.name) ).children();
    },

    param: function(mode, name, value) {
        var len = arguments.length;

        if (len === 0) { return this._param; }


        if (mode === false) {
            if (len === 1) { this._param = {}; }
            else if (len === 2) { delete this._param[name]; }
            else if (len === 3 && name in this._param) {
                this._param[name] = util.array( this._param[name] )
                    .filter(function(val) { return val !== value; });
            }
        } else if (mode === true) {
            if (len === 3) { this._param[name] = [].concat(this._param[name] || [], value); }
        } else {
            value = name;
            name = mode;
            if (len === 1) {
                return this._param[name];
            } else if (len === 2) {
                this._param[name] = value;
            }
        }

        if (mode === true || mode === false || len === 2) {
            this.trigger('param', this);
        }
    },

    /**
     * @param {Array|cool}
     */
    append: function(children, root) {
        var that = this;
        var el = root ? this.el.find(root) : this.el;

        util.array(children).forEach(function(child) {
            that.trigger('append', {});
            el.append(child.el);
            child._parent = that;
        });
    },

    parent: function(name) {
        var parent = this._parent;

        if (!name) { return parent; }

        while (parent) {
            if (parent.name === name) {
                return parent;
            }
            parent = parent._parent;
        }
    },

    appendTo: function(el) {
        var that = this;
        this.promise.then(function() {
            $(el).append(that.el);
        });
    }
};

var statik = {
    _inst: {},
    _const: {},
    _events: {},

    construct: function(desc, extra) {
        var inst, that = this;

        // view defenition
        if (typeof desc === 'object') {

            if (!desc.name) {
                throw new Error('Property name is mandatory.');
            }
            if (this._const[desc.name]) {
                throw new Error('View "' + desc.name + '" is already defined.');
            }

            this._const[ desc.name ] = util.klass(cool.view, desc);

            return cool;

        // view instatntiation
        } else if (typeof desc === 'string') {

            if (!this._const[ desc ]) {
                throw new Error('View "' + desc + '" is not defined. Use cool.view({name: \'' + desc + '\'}) to define it.');
            }

            inst = ( new this._const[ desc ]() )._init(extra || {});

            // ensure instances store
            if (!this._inst[ desc ]) { this._inst[desc] = []; }

            this._inst[desc].push( inst );

            // self binding
            util.each(this._events[ desc ], function(event) {
                console.log('on', event.type, that.name);
                inst.on(event.type, event.callback, event.context);
            });

            return inst;
        }

    }
};


cool._views = {};
cool._events = {};


cool.view = function(desc, extra) {

    // constructor call
    if (this instanceof cool.view) { return; }

    return cool.view.construct(desc, extra);
};

util.extend(cool.view.prototype, init, proto, cool.events);

util.extend(cool.view, statik);

})();

;(function() {

cool._models = {};

var proto = {
    _init: function(params) {
        if (!this.params) {
            this.params = params;
        } else {
            util.extend(this.params, params);
        }

        return this;
    },
    data: function(raw) {
        return raw ? this._data : this.process(this.parse(this._data));
    },
    parse: function(data) {
        return data.result;
    },
    process: function(data) {
        return data;
    },
    read: function(params) {
        return this.sync({
            params: util.extend(this.params, params || {})
        });
    },
    sync: function(options) {
        var that = this;
        var promise = cool.promise();

        $.ajax({
            url: this.url,
            traditional: true,
            data: options.params,
            dataType: 'json',
            success: function(data) {
                that._data = data;
                promise.resolve(that);
                that.trigger('read', that);
            }
        });

        return promise;
    }
};

var statik = {

    EVENTS: util.toObject( ['read'] ),

    _inst: {},
    _const: {},
    _events: {},

    construct: function(desc, extra) {
        var inst, that = this;

        // model defenition
        if (typeof desc === 'object') {

            if (!desc.name) {
                throw new Error('Property name is mandatory.');
            }
            if (this._const[desc.name]) {
                throw new Error('Model "' + desc.name + '" is already defined.');
            }

            this._const[ desc.name ] = util.klass(cool.model, desc);

            return cool;

        // view instatntiation
        } else if (typeof desc === 'string') {

            if (!this._const[ desc ]) {
                throw new Error('Model "' + desc + '" is not defined. Use cool.model({name: \'' + desc + '\'}) to define it.');
            }

            inst = ( new this._const[ desc ]() )._init(extra || {});

            // ensure instances store
            if (!this._inst[ desc ]) { this._inst[desc] = []; }

            this._inst[desc].push( inst );

            // self binding
            util.each(this._events[ desc ], function(event) {
                console.log('on', event.type, that.name);
                inst.on(event.type, event.callback, event.context);
            });

            return inst;
        }

    }
};


cool.model = function(name, extra) {

    if (this instanceof cool.model) { return; }

    return cool.model.construct(name, extra);
};

util.extend(cool.model.prototype, proto, cool.events);
util.extend(cool.model, statik);

})();


})(this, undefined);
