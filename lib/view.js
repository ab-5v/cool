cool._views = {};
cool._view = function() {};
cool._view.prototype = {
    _init: function(data) {
        var that = this;

        // ensure el
        that.el = that.render(data);

        // init events
        cool.util.keys(this.events).forEach(function(event) {
            that.el.on(event, that[ that.events[event] ].bind(that) );
        });

        // init and append views
        [].concat(this.views).forEach(function(name) {
            that.append( cool.view(name) );
        });

        // call user init
        that.init(data);

        return that;
    },

    views: [],
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
    cool._views[ name ] = cool._class(cool._view, extra);

    return cool;
};
