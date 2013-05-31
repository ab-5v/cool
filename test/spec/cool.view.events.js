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

    describe('view', function() {

        beforeEach(function() {
            this.view = new cool.view();
        });

        it('should ensure `view.events`', function() {
            events.view( this.view );

            expect( this.view.events ).to.eql( {} );
        });

        it('should keep original events', function() {
            this.view.events = {'click': 'init'};
            events.view( this.view );

            expect( this.view.events ).to.eql( {'click': 'init'} );
        });

    });


    describe('parse', function() {

        beforeEach(function() {
            this.view = new cool.view();
            this.view.events = {'click': 'init', 'submit': 'render'};
            this.parsed = events.parse( this.view );
        });

        it('should call `info` for each event item', function() {
            sinon.spy(events, 'info');
            events.parse( this.view );

            expect( events.info.calledTwice ).to.be.ok();

            expect( events.info.getCall(0).args ).to.eql( ['click'] );
            expect( events.info.getCall(1).args ).to.eql( ['submit'] );

            events.info.restore();
        });

        it('should return parsed array', function() {

            expect( this.parsed ).to.be.an( Array );
            expect( this.parsed.length ).to.eql( 2 );
        });

        it('should return empty array on no events', function() {
            this.view.events = {};

            expect( events.parse(this.view) ).to.eql( [] );
        });

        it('should return view\'s method as listener', function() {

            expect( this.parsed[0].listener ).to.eql( this.view.init );
        });

    });

});
