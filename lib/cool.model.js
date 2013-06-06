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
    }
});

cool.model._cache = {};

cool.method(cool.model.prototype, {

    init: function(params, data) {

        cool.assert(this.url, 'you should specify url for model %1', this.name);

        this.data(data);
        this.param(params);

        if (!('bibb' in this)) {
            this.bibb = this.name.slice(-1) === 's' ? [] : {};
        }

        return this;
    },

    fetch: function() {
        var url = this.url;
        var type = 'get';
        var params = this.param();
        var promise = cool.promise();

        $.ajax({
            url: url,
            traditional: true,
            type: type,
            data: params,
            context: this,
            dataType: 'json',
            success: function(data) {
                this.data(data);
                promise.resolve(this);
            }
        });

        return promise;
    }

});

cool.model.EVENTS = xtnd.hash([
    'read',
    'readed', /* %) */
    'fetch',
    'fetched',
    'init',
    'inited'
]);

})();
