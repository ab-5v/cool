;(function() {

cool._models = {};

require('./model.proto.js');
require('./model.static.js');

cool.model = function(name, extra) {

    if (this instanceof cool.model) { return; }

    return cool.model.construct(name, extra);
};

util.extend(cool.model.prototype, proto, cool.events);
util.extend(cool.model, statik);

})();
