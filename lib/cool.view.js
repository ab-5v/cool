
cool._fabriq('view', {

    /**
     * Initializes view
     * Requests all models and renders html
     *
     * @param {Object} params for template rendering
     */
    init: function(params) {
        var that = this;

        if ( this.trigger('init', params) === false ) { return this; }

        // bind custom events
        cool._events(this);

        // ensure element
        this.element();

        // render sub views
        this.views = xtnd.map(this.views, function(view) { return cool.view(name); });

        // start loading models
        cool.promise.when( xtnd.map(this.models, function() { return cool.model(name).read(); } ) )
            .then(function(models) {
                that.models = models;
                // add model's data to view's params for rerendering
                xtnd.each(models, function(model) { that.param(model.name, model.data()); });
                // rerender elemen with new data
                that.element();
            });

        return this;
    },

    /**
     * Enshures root view element
     */
    element: function() {

        if ( !this.el ) {
            // rendering element html
            this.el = $( this.render(this.params) ).eq(0);
            // binding dom events to element
            cool._events.dom(this);
        } else {
            // replacing content of existing element
            this.el.html( this.render(this.params) );
        }

        return this;
    },

    append: function(child) {
        this.trigger('append', child)
    }
});
