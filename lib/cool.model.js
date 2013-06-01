;(function() {

cool.factory('model', {});

cool.method(cool.model.prototype, {

    init: function(params, data) {

        cool.assert(this.url, 'you should specify url for model %1', this.name);

        this.data(data);
        this.params(params);

        return this;
    },

    fetch: function() {
        var url = this.url;
        var type = 'get';
        var params = this.params();
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
