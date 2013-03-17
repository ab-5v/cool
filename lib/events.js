cool.events = {
    on: function(name, callback) {
        $(document).on(name + '.' + this.name, callback);
    },
    off: function(name) {
        $(document).off(name + '.' + this.name, callback);
    },
    trigger: function(name, data) {
        $(document).trigger(name + '.' + this.name, data);
    }
};
