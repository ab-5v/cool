;(function(root) {

var util = {
    keys: Object.keys,
    args: function(args, from) {
        return Array.prototype.slice.call(args, from || 0);
    },
    array: function(val) {
        return [].concat(val);
    },
    extend: function(dest) {
        util.args(arguments, 1).forEach(function(src) {
            util.keys(src).forEach(function(key) {
                dest[key] = src[key];
            });
        });
        return dest;
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
    on: function(name, callback) {
        $(document).on(name + '.' + this.name, callback);
    },
    off: function(name) {
        $(document).off(name + '.' + this.name, callback);
    },
    trigger: function(name, data) {
        $(document).trigger(name + '.' + this.name, data);
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
        }

        return info;
    },

    _events: function() {
        var that = this;
        var events = this.events;
        var result = {
            dom: {},
            views: {},
            models: {}
        };

        util.keys(events).forEach(function(key) {
            var event = {};
            var split = key.split('.');
            var action = split.shift();
            var instance = split.join('.');
            var callback = that[ events[key] ].bind(that);

            if (that.views.indexOf(instance) > -1) {

                if (!result.views[instance]) { result.views[instance] = {}; }
                result.views[instance][action] = callback;

            } else if (that.models.indexOf(instance) > -1) {

                if (!result.models[instance]) { result.models[instance] = {}; }
                result.models[instance][action] = callback;

            } else {
                result.dom[key] = callback;
            }
        });

        this.events = result;
    },

    _models: function() {
        var that = this;
        var events = this.events.models;
        var models = this.models;

        this.models = {};

        // init models
        var reads = util.array(models).map(function(name) {
            var event = events[name];
            var model = cool.model(name);
            if (event) {
                util.keys(event).forEach(function(action) {
                    model.on(action, event[action]);
                });
            }

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
        var events = this.events.dom;

        // ensure element
        this.el = that.render(this.data);

        // init events
        util.keys(events).forEach(function(event) {
            var split = event.split(/\s+/);
            var type = split.shift();
            var selector = split.join(' ');

            that.el.on(type, selector, events[event]);
        });

    },

    _views: function() {
        var that = this;
        var events = this.events.views;
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
            this.trigger('param', {name: len === 3 ? name : mode});
        }
    },

    /**
     * @param {Array|cool}
     */
    append: function(children, root) {
        var that = this;
        var el = root ? this.el.find(root) : this.el;

        util.array(children).forEach(function(child) {
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
};


cool._views = {};
cool._events = {};


cool.view = function(desc, extra) {

    // constructor call
    if (this instanceof cool.view) { return; }

    // view defenition
    if (typeof desc === 'object') {

        if (!desc.name) {
            throw new Error('Property name is mandatory.');
        }
        if (cool._views[desc.name]) {
            throw new Error('View "' + desc.name + '" is already defined.');
        }

        cool._views[ desc.name ] = util.klass(cool.view, desc);

        return cool;

    // view instatntiation
    } else if (typeof desc === 'string') {

        if (!cool._views[ desc ]) {
            throw new Error('View "' + desc + '" is not defined. Use cool.view({name: \'' + desc + '\'}) to define it.');
        }

        return ( new cool._views[ desc ]() )._init(extra || {});
    }

};

util.extend(cool.view.prototype, init, proto, cool.events);

util.extend(cool.view, statik);

})();

cool._models = {};

cool._model = function() {};

cool._model.prototype = {
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

cool.model = function(name, extra) {
    extra = extra || {};

    if (cool._models[ name ]) {
        return ( new cool._models[ name ]() )._init(extra);
    }

    extra.name = name;
    cool._models[ name ] = util.klass(cool._model, util.extend(extra, cool.events));

    return cool;
};


})(this, undefined);
