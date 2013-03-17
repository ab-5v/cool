var init = {
    _init: function(data) {
        var that = this;

        this.promise = cool.promise();
        this.data = data;

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
            view[name] = view;
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
