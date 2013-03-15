cool._class = function(parent, extra) {
    var child = function() {};
    child.prototype = new parent();
    cool.util.extend(child.prototype, extra);
    return child;
};
