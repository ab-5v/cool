var statik = {
    _inst: {},
    _const: {},
    _events: {},

    construct: function(desc, extra) {
        var inst, that = this;

        // view defenition
        if (typeof desc === 'object') {

            if (!desc.name) {
                throw new Error('Property name is mandatory.');
            }
            if (this._const[desc.name]) {
                throw new Error('View "' + desc.name + '" is already defined.');
            }

            this._const[ desc.name ] = util.klass(cool.view, desc);

            return cool;

        // view instatntiation
        } else if (typeof desc === 'string') {

            if (!this._const[ desc ]) {
                throw new Error('View "' + desc + '" is not defined. Use cool.view({name: \'' + desc + '\'}) to define it.');
            }

            inst = ( new this._const[ desc ]() )._init(extra || {});

            // ensure instances store
            if (!this._inst[ desc ]) { this._inst[desc] = []; }

            this._inst[desc].push( inst );

            // self binding
            util.each(this._events[ desc ], function(event) {
                inst.on(event.type, event.callback, event.context, event.target);
            });

            return inst;
        }

    }
};
