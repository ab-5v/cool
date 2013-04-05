var proto = {
    views: [],
    models: [],
    events: {},

    init: function() {},

    render: function(data) {
        return $('<div/>').html( yr.run('main', this.data, 'cool-' + this.name) ).children();
    },

    param: function(mode, name, value) {
        var len = arguments.length;

        if (len === 0) { return this._param; }


        if (mode === false) {
            if (len === 1) { this._param = {}; }
            else if (len === 2) { delete this._param[name]; }
            else if (len === 3 && name in this._param) {
                this._param[name] = util.array( this._param[name] )
                    .filter(function(val) { return val !== value; });
            }
        } else if (mode === true) {
            if (len === 3) { this._param[name] = [].concat(this._param[name] || [], value); }
        } else {
            value = name;
            name = mode;
            if (len === 1) {
                return this._param[name];
            } else if (len === 2) {
                this._param[name] = value;
            }
        }

        if (mode === true || mode === false || len === 2) {
            this.trigger('param', {name: len === 2 ? mode : name});
        }
    },

    /**
     * @param {Array|cool}
     */
    append: function(children, root) {
        var that = this;
        var el = root ? this.el.find(root) : this.el;

        if (!this._children) { this._children = []; }

        util.array(children).forEach(function(child) {
            that.trigger({type: 'append', target: child}, {});
            if (child._parent) {
                child._parent.detach(child);
            }
            el.append(child.el);
            child._parent = that;
            that._children.push(child);
        });
    },

    detach: function(child) {

        child._parent = null;
        this._children = this._children.filter(function(item) {
            return item !== child;
        });
    },

    remove: function() {
        this._eventsoff();
        this.el.remove();
    },

    empty: function() {
        var that = this;

        util.each(this._children, function(child) {
            that.detach(child);
            child.remove();
        });
    },

    parent: function(name) {
        var parent = this._parent;

        if (!name) { return parent; }

        while (parent) {
            if (parent.name === name) {
                return parent;
            }
            parent = parent._parent;
        }
    },

    appendTo: function(el) {
        var that = this;
        this.promise.then(function() {
            $(el).append(that.el);
        });
    }
};