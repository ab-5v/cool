var statik = {

    EVENTS: util.toObject( ['read'] ),

    _inst: {},
    _const: {},
    _events: {},

    construct: function(desc, extra) {
        var inst, that = this;

        // model defenition
        if (typeof desc === 'object') {

            if (!desc.name) {
                throw new Error('Property name is mandatory.');
            }
            if (this._const[desc.name]) {
                throw new Error('Model "' + desc.name + '" is already defined.');
            }

            this._const[ desc.name ] = util.klass(cool.model, desc);

            return cool;

        // view instatntiation
        } else if (typeof desc === 'string') {

            if (!this._const[ desc ]) {
                throw new Error('Model "' + desc + '" is not defined. Use cool.model({name: \'' + desc + '\'}) to define it.');
            }

            inst = ( new this._const[ desc ]() )._init(extra || {});

            // ensure instances store
            if (!this._inst[ desc ]) { this._inst[desc] = []; }

            this._inst[desc].push( inst );

            // self binding
            util.each(this._events[ desc ], function(event) {
                console.log('on', event.type, that.name);
                inst.on(event.type, event.callback, event.context);
            });

            return inst;
        }

    }
};
