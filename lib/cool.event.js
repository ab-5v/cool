
cool.event = function() {

    var event = {
        _prevented: true,
        preventDefault: function() {
            event._prevented = true;
        }
    };

    return event;
};
