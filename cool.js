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

cool._views = {};
cool._view = function() {};
cool._view.prototype = {
    _init: function(data) {
        var that = this;
        var promise = cool.promise();

        // init models
        var models = util.array(that.models).map(function(name) {
            return cool.model(name).read();
        });

        cool.promise.when(models).then(function(models) {
            that.models = {};
            models.forEach(function(model) {
                data[model.name] = model.data;
                that.models[model.name] = model;
            });

            // ensure el
            that.el = that.render(data);

            // init events
            util.keys(that.events).forEach(function(event) {
                that.el.on(event, that[ that.events[event] ].bind(that) );
            });

            // init and append views
            var views = util.array(that.views).map(function(name) {
                return cool.view(name);
            });

            cool.promise.when(views).then(function(views) {
                views.forEach(function(view) {
                    that.append(view);
                });
                promise.resolve(that);
            });

            // call user init
            that.init(data);
        });


        return promise;
    },

    views: [],
    models: [],
    events: {},

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
    cool._views[ name ] = util.klass(cool._view, extra);

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
    cool._models[ name ] = util.klass(cool._model, extra);

    return cool;
};


})(this, undefined);
