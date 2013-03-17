var proto = {
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

        util.array(children).forEach(function(child) {
            that.el.append(child.el);
        });
    },

    appendTo: function(el) {
        var that = this;
        this.promise.then(function() {
            $(el).append(that.el);
        });
    }
};
