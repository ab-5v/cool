describe('cool.events', function() {

    beforeEach(function() {
        this.emitter = xtnd({}, cool.events);
        this.listener = sinon.spy();
    });

    describe('_event', function() {

        it('should create event by `type`', function() {
            var event = this.emitter._event('hello');

            expect( event ).to.have.property( 'type', 'hello' );
            expect( event ).to.have.property( 'owner', this.emitter );
            expect( event ).to.have.property( '_prevented', false );
            expect( event.preventDefault ).to.be.a( Function );
        });

        it('should extend event by `extra`', function() {
            expect( this.emitter._event('hello', {a: 1}) )
                .to.have.property( 'a', 1 );
        });

        it('should preventDefault', function() {
            var event = this.emitter._event('hello');
            event.preventDefault();

            expect( event ).to.have.property( '_prevented', true );
        });

    });

    describe('on', function() {

        it('should throw if listener is not a function', function() {
            var emitter = this.emitter;

            expect( function() { emitter.on('hello'); } )
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

        beforeEach(function() {
            this.f1 = function() {};
            this.f2 = function() {};

            this.ctx1 = {};
            this.ctx2 = {};

            this.emitter._events = {
                hello: [
                    {listener: this.f1},
                    {listener: this.f2, context: this.ctx1}
                ],
                aloha: [
                    {listener: this.f2},
                    {listener: this.f1, context: this.ctx2}
                ]
            };

            this.events = this.emitter._events;
        });

        it('should skip if no store found for specified type', function() {
            this.emitter.off('foo');

            expect( this.events.hello.length ).to.eql( 2 );
            expect( this.events.aloha.length ).to.eql( 2 );
        });

        it('should remove all listeners by type', function() {
            this.emitter.off('hello');

            expect( this.events.hello.length ).to.eql( 0 );
            expect( this.events.aloha.length ).to.eql( 2 );
        });

        it('should remove by listener', function() {
            this.emitter.off(null, this.f1);

            expect( this.events.hello.length ).to.eql( 1 );
            expect( this.events.aloha.length ).to.eql( 1 );
        });

        it('should remove by context', function() {
            this.emitter.off(null, null, this.ctx1);

            expect( this.events.hello.length ).to.eql( 1 );
            expect( this.events.aloha.length ).to.eql( 2 );
        });

        it('should remove by type and listener', function() {
            this.emitter.off('hello', this.f1);

            expect( this.events.hello.length ).to.eql( 1 );
            expect( this.events.aloha.length ).to.eql( 2 );
        });

        it('should remove by type and context', function() {
            this.emitter.off('hello', null, this.ctx1);

            expect( this.events.hello.length ).to.eql( 1 );
            expect( this.events.aloha.length ).to.eql( 2 );
        });

        it('should remove by listener and context', function() {
            this.emitter.off(null, this.f2, this.ctx1);

            expect( this.events.hello.length ).to.eql( 1 );
            expect( this.events.aloha.length ).to.eql( 2 );
        });

        it('should clear all event with no arguments', function() {
            this.emitter.off();

            expect( this.events.hello.length ).to.eql( 0 );
            expect( this.events.aloha.length ).to.eql( 0 );
        });

        it('should return `this`', function() {
            expect( this.emitter.off('foo') ).to.eql( this.emitter );
            expect( this.emitter.off('hello') ).to.eql( this.emitter );
        });

    });

    describe('emit', function() {

        beforeEach(function() {
            this.f1 = sinon.spy();
            this.f2 = sinon.spy();
            this.f3 = sinon.spy();
            this.f4 = sinon.spy();

            this.ctx1 = {};
            this.ctx2 = {};

            this.emitter._events = {
                hello: [
                    {listener: this.f1},
                    {listener: this.f2, context: this.ctx1}
                ],
                aloha: [
                    {listener: this.f3},
                    {listener: this.f4, context: this.ctx2}
                ]
            };

            this.events = this.emitter._events;
        });

        it('shoult call _event if type passed', function() {
            sinon.spy(this.emitter, '_event');

            this.emitter.emit('hello');

            expect( this.emitter._event.calledOnce ).to.be.ok();
            expect( this.emitter._event.getCall(0).args[0] )
                .to.eql( 'hello' );
        });

        it('should call every listener of specified type', function() {
            this.emitter.emit('hello');

            expect( this.f1.calledOnce ).to.be.ok();
            expect( this.f2.calledOnce ).to.be.ok();

            expect( this.f3.called ).not.to.be.ok();
            expect( this.f4.called ).not.to.be.ok();
        });

        it('should pass event object', function() {
            this.emitter.emit('hello');

            expect( this.f1.getCall(0).args[0] )
                .to.eql( this.emitter._event('hello') );
        });

        it('should pass data object', function() {
            this.emitter.emit('hello', {a: 1});

            expect( this.f1.getCall(0).args[1] )
                .to.eql( {a: 1} );
        });

        it('should set context of listener', function(done) {
            this.emitter.on('hello', function() {

                expect( this ).to.eql( {a: 2} );
                done();

            }, {a: 2});

            this.emitter.emit('hello');
        });

    });

});
