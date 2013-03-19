cool.events = {

    on: function(type, callback, context) {
        var events = this._customevents = this._customevents || {};

        if (!events[type]) { events[type] = []; }

        events[type].push({
            callback: callback,
            context: context || this
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
            item.callback.call(item.context, event, data);
        });
    }
};
