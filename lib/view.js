;(function() {

require('./view.init.js');
require('./view.proto.js');

cool._views = {};

cool._view = function() {};
cool._view.prototype = util.extend({}, init, proto, cool.events);

cool.view = function(name, extra) {
    extra = extra || {};

    if (cool._views[ name ]) {
        return ( new cool._views[ name ]() )._init(extra);
    }

    extra.name = name;
    cool._views[ name ] = util.klass(cool._view, extra);

    return cool;
};

})();
