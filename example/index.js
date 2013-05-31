
cool.view({
    name: 'app',
    views: ['view1', 'view2']
});

cool.view({
    name: 'view1'
});

cool.view({
    name: 'view2'
});


cool.view('app').one('rendered', function() {
    $('body').append(this.el);
});
