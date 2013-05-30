describe('cool.view.events', function() {

    var events = cool.view.events;

    describe('info', function() {

        var mock = {
            'click': {
                type: 'click'
            },
            'click .b-button': {
                type: 'click', target: '.b-button'
            },
            'click .b-button .js-button': {
                type: 'click', target: '.b-button .js-button'
            },
            'submit form': {
                type: 'submit', target: 'form'
            },
            'model.read': {
                type: 'read', owner: 'model'
            },
            'append subview': {
                type: 'append', target: 'subview'
            },
            'view.append subview': {
                type: 'append', owner: 'view', target: 'subview'
            }
        };

        xtnd.each(mock, function(result, description) {

            it('should parse "' + description + '"', function() {

                expect( events.info(description) ).to.eql( result );
            });
        });
    });


});
