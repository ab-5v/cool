/*
var proto = {

    _init: function(params) {
        if (!this.params) {
            this.params = params;
        } else {
            util.extend(this.params, params);
        }

        return this;
    },

    data: function(raw) {
        return raw ? this._data : this.process(this.parse(this._data));
    },

    parse: function(data) {
        return data.result;
    },

    process: function(data) {
        return data;
    },

    read: function(params) {
        return this.sync({
            type: 'get',
            params: util.extend(this.params, params || {})
        });
    },

    create: function(params) {
        return this.sync({
            type: 'post',
            params: util.extend(this.params, params || {})
        });
    },

    sync: function(options) {
        var promise = cool.promise();
        var type = options.type;
        var params = options.params;

        $.ajax({
            url: this.url,
            traditional: true,
            type: type,
            data: params,
            context: this,
            dataType: 'json',
            success: function(data) {
                this._data = data;
                promise.resolve(this);
                this.trigger('read', this.data());
            }
        });

        return promise;
    }
};
*/
