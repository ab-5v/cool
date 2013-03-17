cool._models = {};

cool._model = function() {};

cool._model.prototype = {
    _init: function(params) {
        return this;
    },
    params: {},
    read: function() {
        return this.sync();
    },
    sync: function(options) {
        var that = this;
        var promise = cool.promise();

        $.ajax({
            url: this.url,
            dataType: 'json',
            complete: function() {
                promise.resolve(that);
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
    cool._models[ name ] = util.klass(cool._model, extra);

    return cool;
};
