cool.events = {

    on: function(type, callback, context, target) {
        var events = this._customevents = this._customevents || {};

        if (!events[type]) { events[type] = []; }

        events[type].push({
            callback: callback,
            context: context || this,
            target: target
        });

        return this;
    },

    trigger: function(type, data) {
        var event = { owner: this };
        var events = this._customevents;

        if (typeof type === 'string') {
            util.extend(event, {type: type});
        } else if (typeof type === 'object') {
            util.extend(event, type);
            type = event.type;
        }

        util.each(events && events[type], function(item) {
            if ( !(event.target && item.target) || event.target === item.target || event.target.name === item.target ) {
                item.callback.call(item.context, event, data);
            }
        });
    }
};
