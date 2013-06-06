;(function() {

cool.factory('model', {

    /**
     * Resolves `params` by one specified on model defenition
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
