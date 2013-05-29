;(function(){

/**
 * Events mixin
 */
var events = {

    /**
     * Listeners store
     *
     * @type Object
     */
    _events: null,

    /**
     * Event constructor
     *
     * @private
     *
     * @param {String} type
     * @param {Object} extra
     *
     * @returns Object
     */
    _event: function(type, extra) {

        var event = {
            type: type,
            owner: this
        };

        if (extra) {
            event.extend(extra);
        }

        return event;
    },

    /**
     * Adds listener for the specified event
     *
     * @param {String} type
     * @param {Function} listener
     * @param {Object} context
     *
     * @returns this
     */
    on: function(type, listener, context) {
        var events = this._events = this._events || {};

        cool.assert(typeof listener === 'function',
            'listener for %1 should be a function', type);

        if (!events[type]) { events[type] = []; }

        events[type].push({
            listener: listener,
            context: context || this
        });

        return this;
    },

    /**
     * Removes listener by event/listener/context
     *
     * @param {String} type
     * @param {Function} listener
     * @param {Object} context
     *
     * @returns this
     */
    off: function(type, listener, context) {
        var events = this._events;

        if (type) {
            events = events && events[type];
        } else {
            type = xtnd.keys(events);
        }
        if (!events) { return this; }

        xtnd.each(type, function(type) {
            events[type] = events[type].filter(function(item) {
                return !(context && context === item.context
                    || listener && listener === item.listener);
            });
        });

        return this;
    },

    /**
     * Executes each of the listeners
     *
     * @param {Object|String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        var events = this._events;

        if (typeof event === 'stings') {
            event = this._event(event);
        }

        events = events && events[event.type];

        xtnd.each(events, function(item) {
            item.listener.call(item.context, event, data);
        });

    }
};

cool.events = events;

})();
