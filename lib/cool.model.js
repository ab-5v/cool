;(function() {

cool.factory('model', {

    /**
     * Resolves `params` by one specified on model defenition
     *
     * @private
     *
     * @param {Object} params
     *
     * @returns Object
     */
    _params: function(params) {
        var res = {};

        xtnd.each(this.params, function(val, key) {
            if (key in params) {
                res[key] = params[key];
            } else if (val === null) {
                res = null;
                return false;
            } else if (val !== undefined) {
                res[key] = val;
            }
        });

        return res;
    },

    /**
     * Generates unique key for current model
     *
     * @param {Object} params
     *
     * @returns String
     */
    key: function(params) {
        var key = $.param(params, true);
        return this.name + (key ? '?' : '') + key;
    },

    /**
     * Some default for $.ajax
     *
     * @returns Object
     */
    defaults: function() {
        return {
            url: this.url,
            type: 'get',
            context: this,
            dataType: 'json'
        };
    },

    cache: function(params, data) {
        var key = this.key(params);

        if (data) {
            this._cache[key] = data;
        } else {
            return this._cache[key];
        }
    },

    /**
     * Creates $.ajax() request,
     * aborts previous requests,
     * stores created request
     *
     * @param {Object} options
     *
     * @returns Object
     */
    request: function(options) {
        if (this._request) {
            this._request.abort();
        }

        this._request = $.ajax(options)
            .always(function() { this._request = undefined; });

        return this._request;
    },

    /**
     * Syncronizes data with server
     *
     * @param {Object} options
     */
    sync: function(options) {
        options = options || {};
        options.data = options.data || {};

        var promise = cool.promise();
        var params = this._params(options.data);

        if (!params) {
            return promise.resolve(this.bibb);
        }

        options = xtnd(this.defaults(), options);
        options.data = params;

        var cache = this.cache(params);
        if (cache) {
            return promise.resolve(cache);
        }

        this.request(options)
            .done(function(data) {
                this.cache(params, data);

                promise.resolve(data);
            });

        return promise;
    }
});

cool.model._cache = {};

cool.method(cool.model.prototype, {

    init: function(params, data) {

        cool.assert(this.url, 'you should specify url for model %1', this.name);

        if (!('bibb' in this)) {
            this.bibb = this.name.slice(-1) === 's' ? [] : {};
        }

        this._cache = {};

        this.data(data);
        this.param(params);

        return this;
    },

    fetch: function(params) {
        xtnd(params, this.param());

        return this.sync({
            type: 'get',
            data: params
        });
    },

    create: function(params) {
        xtnd(params, this.param());

        return this.sync({
            type: 'post',
            data: params
        });
    }

});

cool.model.EVENTS = xtnd.hash([
    'fetch',
    'fetched',
    'init',
    'inited'
]);

})();
