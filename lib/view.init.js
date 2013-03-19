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
        var that = this;
        var statik = cool[type];
        var events = statik._events;
        var target = event.target === 'this' ? this : event.target;

        // queue for the future events
        if (!events[ event.owner ]) { events[ event.owner ] = []; }

        events[ event.owner ].push( {type: event.type, callback: callback, context: that, target: target} );

        // existing views
        util.each(statik._inst[ event.owner ], function(inst) {
            inst.on(event.type, callback, that, target);
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

    _eventsoff: function() {
        var that = this;

        util.each(['view', 'model'], function(type) {
            var insts = cool[type]._inst;
            var events = cool[type]._events;

            // removing events from queue
            util.each(events, function(items, owner) {
                events[owner] = items.filter(function(item) { return that !== item.context; });
            });

            // removing existing events
            util.each(insts, function(items, owner) {
                util.each(items, function(inst) { inst.off(null, null, that); });
            });
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
