;(function() {


var method = function(name, action) {

    return function() {
        var reply, event;
        var that = this;
        var args = xtnd.array(arguments);

        action = method.bindAction(action, this, args);
        event = this._event(name, {action: action});

        this.emit(event);

        if (event._prevented) { return; }

        reply = action();
        event = this._event(name + 'ed');

        if (pzero.is(reply)) {
            reply.then(function(data) {
                that.emit(event, data);
            });
        } else {
            this.emit(event, reply);
        }

        return reply;
    };
};

method.bindAction = function(action, context, args) {
    var reply, resolved = false;

    return function() {
        if (!resolved) {
            reply = action.apply(context, args)
            resolved = true;
        }

        return reply;
    }
};

cool.method = method;

})();
