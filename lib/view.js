/*
;(function() {

require('./view.init.js');
require('./view.proto.js');
require('./view.static.js');

cool._views = {};
cool._events = {};


cool.view = function(desc, extra) {

    // constructor call
    if (this instanceof cool.view) { return; }

    return cool.view.construct(desc, extra);
};

util.extend(cool.view.prototype, init, proto, cool.events);

util.extend(cool.view, statik);

})();
*/
