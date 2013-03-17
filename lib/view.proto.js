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
    append: function(children, root) {
        var that = this;
        var el = root ? this.el.find(root) : this.el;

        util.array(children).forEach(function(child) {
            el.append(child.el);
        });
    },

    appendTo: function(el) {
        var that = this;
        this.promise.then(function() {
            $(el).append(that.el);
        });
    }
};
