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

        events.view(that);

        that.data(data);
        that.params(params);

        init.models(that)
            .then(function() {
                that.render();
            });

        init.views(that);

        return this;
    },

    /**
     * Ensures element
     * and replaces its content
     */
    render: function() {

        var json = this.toJSON();
        var html = this.html( json );
        var el = $( html ).eq(0);

        if (this.el) {
            this.el.html( el.html() );
        } else {
            this.el = el;
        }
    },

    /**
     * Appends subview
     *
     * @param {cool.view} view
     */
    append: function(view) {
        var name = view.name;
        var views = this._views;

        if (!views[name]) {
            views[name] = [];
        }

        if (view._parent) {
            view.detach(true);
        }

        this.el.append(view.el);
        view._parent = this;
        views[name].push(view);
    },

    /**
     * Removes view
     * from it's parent subviews list.
     * Removes subview from DOM if `!skipDom`
     *
     * @param {Boolean} skipDom
     */
    detach: function(skipDom) {

        cool.assert(this._parent,
            'detach for %1 called w/o _parent', this.name);

        var views = this._parent._views[this.name];
        var index = views.indexOf(this);

        if (index > -1) {
            views.splice(index, 1);
        } else {
            // indicates inifite recursion
            cool.assert(0,
                'view %1 not found in subviews', this.name);
        }

        delete this._parent;

        if (!skipDom) {
            this.el.detach();
        }
    },

    /**
     * Removes view from wherever,
     * unbind it's events and destroys it.
     */
    remove: function() {

        if (this._parent) {
            this.detach();
        }

        this.empty();

        this.el.remove();
    },

    /**
     * Removes all subviews
     */
    empty: function() {

        xtnd.each(this._views, function(set) {
            while (set.length) { set[0].remove(); }
        });
    }

});

var init = {

    views: function(that) {
        var data = that.data();
        var params = that.params();
        var views = that._views = {};

        xtnd.each(that.views, function(name) {

            var view = cool.view(name, params, data);

            views[name] = view;

            if (view.el) {
                that.append(view);
            } else {
                view.one('rendered', function() {
                    that.append(this);
                });
            }
        });
    },

    models: function(that) {
        var models = {};
        var data = that.data();
        var params = that.params();

        var fetches = xtnd.map(that.models, function(name) {
            models[name] = cool.model(name, params, data);
            return models[name].fetch();
        });

        that.models = models;

        return cool.promise.when(fetches);
    }
};

cool.view.init = init;

var events = {

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
    },

    /**
     * Initialize events for the view
     *
     * @param {cool.view} view
     */
    view: function(view) {

        var parsed = events.parse();
        //view.one('rendered', function() {
        //    events.dom(view, parsed);
        //});

        events.on(view, parsed);

    },

    /**
     * Parses user's defined events
     *
     * @param {cool.view} view
     */
    parse: function(view) {
        return view;
    },

    /**
     * Binds custom events
     *
     * @param {cool.view} view
     */
    on: function(view) {
        return view;
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
     */
    dom: function(view) {
        return view;
    }

};

cool.view.events = events;
})();
