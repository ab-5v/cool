;(function() {

require('./view.init.js');
require('./view.proto.js');
require('./view.static.js');

cool._views = {};
cool._events = {};


cool.view = function(desc, extra) {

    // constructor call
    if (this instanceof cool.view) { return; }

    // view defenition
    if (typeof desc === 'object') {

        if (!desc.name) {
            throw new Error('Property name is mandatory.');
        }
        if (cool._views[desc.name]) {
            throw new Error('View "' + desc.name + '" is already defined.');
        }

        cool._views[ desc.name ] = util.klass(cool.view, desc);

        return cool;

    // view instatntiation
    } else if (typeof desc === 'string') {

        if (!cool._views[ desc ]) {
            throw new Error('View "' + desc + '" is not defined. Use cool.view({name: \'' + desc + '\'}) to define it.');
        }

        return ( new cool._views[ desc ]() )._init(extra || {});
    }

};

util.extend(cool.view.prototype, init, proto, cool.events);

util.extend(cool.view, statik);

})();
