cool.method = function(name, action) {

    return function() {
        var reply;
        var that = this;
        var args = xtnd.array(arguments);
        var event = cool.event();
        var executed = false;

        action = function() {
            if (!executed) {
                reply = action.apply(that, args);
                executed = true;
            }

            return reply;
        };

        event.extend({
            name: name,
            owner: this,
            action: action
        });

        this.trigger(event);

        if (event._prevented) { return; }

        reply = action();
        event.name = name + 'ed';

        if (pzero.is(reply)) {
            reply.then(function(data) {
                this.trigger(event, data);
            });
        } else {
            this.trigger(event, reply);
        }

        return reply;
    };
};
