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

cool._views = {};
cool._view = function() {};
cool._view.prototype = {

    views: [],
    models: [],
    events: {},

    _init: function(data) {
        var that = this;

        this.data = data;

        // reorgonize events
        this._events();

        return this._models()
            .then(this._element.bind(this))
            .then(this._views.bind(this))
            .then(function() {
                that.init(that.data);
                return that;
            });
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
                that.data[model.name] = model.data;
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
            view[name] = view;
            return view;
        });

        // append views when they are ready
        return cool.promise.when(views).then(function(views) {
            views.forEach(function(view) {
                that.append(view);
            });

            return that;
        });
    },

    init: function() {},

    render: function(data) {
        return $('<div/>').html( yr.run('main', this.data, 'cool-' + this.name) ).children();
    },

    /**
     * @param {Array|cool}
     */
    append: function(children) {
        var that = this;

        [].concat(children).forEach(function(child) {
            that.el.append(child.el);
        });
    },

    appendTo: function(el) {
        $(el).append(this.el);
    }
};

cool.view = function(name, extra) {
    extra = extra || {};

    if (cool._views[ name ]) {
        return ( new cool._views[ name ]() )._init(extra);
    }

    extra.name = name;
    cool._views[ name ] = util.klass(cool._view, util.extend(extra, cool.events));

    return cool;
};

cool._models = {};

cool._model = function() {};

cool._model.prototype = {
    _init: function(params) {
        return this;
    },
    params: {},
    read: function() {
        return this.sync();
    },
    sync: function(options) {
        var that = this;
        var promise = cool.promise();

        $.ajax({
            url: this.url,
            dataType: 'json',
            complete: function() {
                promise.resolve(that);
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
