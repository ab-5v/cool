cool._models = {};

cool._model = function() {};

cool._model.prototype = {
    _init: function(params) {
        return this;
    },
    params: {},
    data: function(raw) {
        return raw ? this._data : this.parse(this._data);
    },
    parse: function(data) {
        return data.result;
    },
    read: function() {
        return this.sync();
    },
    sync: function(options) {
        var that = this;
        var promise = cool.promise();

        $.ajax({
            url: this.url,
            dataType: 'json',
            success: function(data) {
                that._data = data;
                promise.resolve(that);
                that.trigger('read', that);
            }
        });

        return promise;
    }
};

cool.model = function(name, extra) {
    extra = extra || {};

    if (cool._models[ name ]) {
        return ( new cool._models[ name ]() )._init(extra);
    }

    extra.name = name;
    cool._models[ name ] = util.klass(cool._model, util.extend(extra, cool.events));

    return cool;
};
