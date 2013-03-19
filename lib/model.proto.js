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
            params: util.extend(this.params, params || {})
        });
    },
    sync: function(options) {
        var that = this;
        var promise = cool.promise();

        $.ajax({
            url: this.url,
            traditional: true,
            data: options.params,
            dataType: 'json',
            success: function(data) {
                that._data = data;
                promise.resolve(that);
                that.trigger('read', that.data());
            }
        });

        return promise;
    }
};
