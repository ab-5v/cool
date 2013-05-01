var cool = function() {};

// require('cool.factory.js');

cool._factory('view', {
    _init: function(this) {
        cool.view._init.call(this, data);
        return this;
    },
    data: function() {},
    param: function() {},
    render: function() {},
    append: function() {},
    appendTo: function() {},
    empty: function() {},
    remove: function() {},
});

//cool.view({...});
//cool.view('name', data);
//cool.view('name');
//cool.view.find('name')
//
//
//cool.model({...});
//cool.model('name');
//cool.model('name', params);
