describe('cool.events', function() {

    beforeEach(function() {
        this.emitter = ({}).extend(cool.events);
        this.listener = sinon.spy();
    });

    describe('_event', function() {

        it('should create event by `type`', function() {
            expect( this.emitter._event('hello') )
                .to.eql( {type: 'hello', owner: this.emitter} );
        });

        it('should extend event by `extra`', function() {
            expect( this.emitter._event('hello', {a: 1}) )
                .to.have.property( 'a', 1 );
        });

    });

    describe('on', function() {

        it('should throw if listener is not a function', function() {
            var emitter = this.emitter;

            expect( function() { emitter.on('hello') } )
                .to.throwError(/should be a function/);
        });

        it('should ensure events store', function() {
            this.emitter.on('hello', this.listener);

            expect( this.emitter._events.hello )
                .to.be.an( Array );
        });

        it('should add item to new store', function() {
            this.emitter.on('hello', this.listener);

            expect( this.emitter._events.hello.length )
                .to.eql( 1 );
        });

        it('should add item to existing store', function() {
            this.emitter._events = { hello: [{}] };
            this.emitter.on('hello', this.listener);

            expect( this.emitter._events.hello.length )
                .to.eql( 2 );
        });

        it('should add listener to the store', function() {
            this.emitter.on('hello', this.listener);

            expect( this.emitter._events.hello[0].listener )
                .to.eql( this.listener );
        });

        it('should add context to the store', function() {
            this.emitter.on('hello', this.listener, {a: 1});

            expect( this.emitter._events.hello[0].context )
                .to.eql( {a: 1} );
        });

        it('should add `this` as a context if not specified', function() {
            this.emitter.on('hello', this.listener);

            expect( this.emitter._events.hello[0].context )
                .to.eql( this.emitter );
        });

        it('should return `this`', function() {

            expect( this.emitter.on('hello', this.listener) )
                .to.eql( this.emitter );
        });

    });

    describe('off', function() {

        it('should skip if no store found', function() {
            
        });

        it('should remove all listeners by type', function() {
            
        });

        it('should remove by listener', function() {
            
        });

        it('should remove by context', function() {
            
        });

        it('should return `this`', function() {
            
        });

    });

    describe('emit', function() {

        it('shoult call _event if type passed', function() {
            
        });

        it('should call every istener of specified type', function() {
            
        });

        it('should pass event object', function() {
            
        });

        it('should pass data object', function() {
            
        });

    });

});
