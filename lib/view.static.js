var statik = {
    construct: function(desc, extra) {

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

    }
};
