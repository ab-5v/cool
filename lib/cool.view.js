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
        var data = that.data;
        var params = that.params;

        xtnd.each(that.views, function(name) {
            views[name] = cool.view(name, params, data);
            views[name].one('rendered', function() {
                that.append(this);
            });
        });

        that.views = views;
    },

    models: function(that) {
        var models = {};

        var fetches = xtnd.map(that.models, function(name) {
            models[name] = that.model(name, that.params);
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
    }
};

cool.view.events = events;
})();
