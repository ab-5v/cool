
view = cool._class(core, {
});

cool.view = function(options) {
    return cool._class(view, options);
};

cool.view.overwrite = function(options) {
    for (var key in options) {
        cool._view.prototype[key] = options[key];
    }
};
