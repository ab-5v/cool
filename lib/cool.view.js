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
            params: this.param()
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

        that.data(data);
        that.param(params);

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
        var params = that.param();
        var views = that._views = {};

        xtnd.each(that.views, function(name) {

            var view = cool.view(name, params, data);

            if (!views[name]) {views[name] = [];}

            views[name].push(view);

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
        var params = that.param();

        var fetches = xtnd.map(that.models, function(name) {
            models[name] = cool.model(name, params, data);
            return models[name].fetch();
        });

        that.models = models;

        return cool.promise.when(fetches);
    }
};

cool.view.init = init;

})();
