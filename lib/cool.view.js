;(function() {
cool.factory('view', {

    /**
     * Initializes view
     * Requests all models and renders html
     *
     * @private
     * @param {Object} params for template rendering
     */
    _init: function(params) {
        var that = this;

        this.params = params;

        // ensure element
        this.element();

        // render sub views
        this.views = xtnd.map(this.views, function(view) {
            var view = cool.view(name);
            view.one('inited', that.append);
            return cool.view(name);
        });


        return promise();
        return this;
    },

    /**
     * Renders HTML string
     *
     * @param {Object} params
     *
     * @return String
     */
    render: function(params) {
        return '<h1>' + params.name + '</h1>';
    },

    /**
     * Enshures root view element
     */
    element: function() {

        var el = $( this.render(this.params) ).eq(0);

        if ( !this.el ) {
            // rendering element html
            this.el = el;
        } else {
            // replacing content of existing element
            this.el.html( el.html() );
        }

        return this;
    },

    append: function(child) {
        this.trigger('append', child);
    }
});

var init = cool.method('init', function(params) {
    var that = this;

    init.events(that);
    init.models(this)
        .then(function() {
            that.render();
            init.events(that, true);
        });

    init.views(this);

    return this;
});

xtnd(init, {

    views: function(that) {
        var views = {};

        xtnd.each(that.views, function(name) {
            views[name] = cool.view(name, that.params);
            views[name].one('rendered', function() {
                that.append(this);
            });
        });
    },

    models: function(that) {
        var models = {};

        var fetches = xtnd.map(that.models, function(name) {
            models[name] = that.model(name);
            return models[name].fetch(that.params);
        });

        view.models = models;

        return cool.promise.when(fetches);
    },

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

        cool.assert(match, 'wrong event format %1', desc)

        if (match[2]) { info.type = match[2]; }
        if (match[1]) { info.owner = match[1]; }
        if (match[3]) { info.target = match[3]; }

        return info;
    },

    events: function(that) {
    },


});

cool.view.init = init;

})();
