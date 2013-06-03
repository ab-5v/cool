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
    _events: undefined,

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
            slave: undefined,
            emitter: this,

            operation: {},
           _prevented: false,
            preventDefault: preventDefault
        };

        xtnd(event, extra);

        return event;
    },

    /**
     * Adds listener for the specified event
     *
     * @param {String} type
     * @param {Function} listener
     * @param {String} slave
     *
     * @returns this
     */
    on: function(type, listener, slave) {
        var events = this._events = this._events || {};

        cool.assert(typeof listener === 'function',
            'listener for %1 should be a function', type);

        if (!events[type]) { events[type] = []; }

        events[type].push({
            listener: listener,
            slave: slave || '*'
        });

        return this;
    },

    /**
     * Removes listener by event/listener/slave
     *
     * @param {String} type
     * @param {Function} listener
     * @param {String} slave
     *
     * @returns this
     */
    off: function(type, listener, slave) {
        var events = this._events;

        if (type) {
            events = events && events[type] && events;
        } else {
            type = xtnd.keys(events);
        }
        if (!events) { return this; }

        xtnd.each(type, function(type) {
            events[type] = events[type].filter(function(item) {
                var exclude = true;
                var slaveMatch = slave === item.slave;
                var listenerMatch = listener === item.listener;

                // exclude all
                if (!slave && !listener) {
                    exclude = true;
                // exclude by slave
                // but can't exclude '*' by specific slave
                } else if (slave && !listener) {
                    exclude = slaveMatch;
                // exclude by listener
                } else if (!slave && listener) {
                    exclude = listenerMatch;
                // exclude by both slave and listener
                } else {
                    exclude = slaveMatch && listenerMatch;
                }

                return !exclude;
            });
        });

        return this;
    },

    /**
     * Adds listener for specified event
     * and removes it after first execution
     *
     * @param {String} type
     * @param {Function} listener
     * @param {Object} slave
     */
    one: function(type, listener, slave) {
        var that = this;

        cool.assert(typeof listener === 'function',
            'listener for %1 should be a function', type);

        var proxy = function() {
            listener.apply(this, arguments);
            that.off(type, proxy, slave);
        };

        this.on(type, proxy, slave);

        return this;
    },

    /**
     * Executes each of the listeners
     *
     * @param {Object|String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        var that = this;
        var events = this._events;

        if (typeof event === 'string') {
            event = this._event(event);
        }

        events = events && events[event.type];

        xtnd.each(events, function(item) {
            if (item.slave === '*' || event.slave === item.slave) {
                item.listener.call(that, event, data);
            }
        });

    }
};

cool.events = events;

function preventDefault() {
    this._prevented = true;
}

})();
