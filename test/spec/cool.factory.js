describe('cool.factory', function() {

    var factory = cool.factory;

    afterEach(function() {
        delete cool.test1;
        delete cool.test2;
    });

    it('should produce specified type of object', function() {
        factory('test1', {});

        expect( cool.test1 ).to.be.a( Function );
    });

    it('should extend prototype with object', function() {
        factory('test1', {a: 1});

        expect( cool.test1.prototype )
            .to.have.property( 'a', 1 );
    });

    it('should save type as static property', function() {
        factory('test1', {});

        expect( cool.test1._type ).to.eql( 'test1' );
    });

    it('should pass arguments to ctor', function() {
        factory('test1', {a: 1});
        sinon.stub(cool.test1, 'ctor');

        cool.test1(1, 2, 3);

        expect( cool.test1.ctor.getCall(0).args ).to.eql( [1, 2, 3] );
    });

    ['ctor', 'define', 'create']
        .forEach(function(name) {

        it('should add static method ' + name, function() {
            factory('test1', {});

            expect( cool.test1[name] ).to.be.a( Function );
        });
    });

    ['_insts', '_ctors', '_events'].forEach(function(store) {

        it('should have its own static store ' + store, function() {
            factory('test1', {});
            factory('test2', {});

            expect( cool.test1[store] )
                .not.to.be( cool.test2[store] );
        });
    });

    describe('ctor', function() {

        beforeEach(function() {
            sinon.stub(factory, 'define');
            sinon.stub(factory, 'create');
        });

        afterEach(function() {
            factory.define.restore();
            factory.create.restore();
        });

        it('should choose "define" for object', function() {
            factory.ctor({name: 'hello'});

            expect( factory.define.calledOnce ).to.be.ok();
            expect( factory.define.getCall(0).args[0] )
                .to.eql( 'hello' );
            expect( factory.define.getCall(0).args[1] )
                .to.eql( {name: 'hello'} );
        });

        it('should choose "create" for string', function() {
            factory.ctor('hello', {a: 1});

            expect( factory.create.calledOnce ).to.be.ok();
            expect( factory.create.getCall(0).args[0] )
                .to.eql( 'hello' );
            expect( factory.create.getCall(0).args[1] )
                .to.eql( {a: 1} );
        });

        it('should ensure params for "create"', function() {
            factory.ctor('hello');

            expect( factory.create.getCall(0).args[1] )
                .to.eql( {} );
        });

        it('should ensure data for "create"', function() {
            factory.ctor('hello');

            expect( factory.create.getCall(0).args[2] )
                .to.eql( {} );
        });

        it('should pass params', function() {
            factory.ctor('hello', {a: 1});

            expect( factory.create.getCall(0).args[1] )
                .to.eql( {a: 1} );
        });

        it('should pass data', function() {
            factory.ctor('hello', null, {b: 2});

            expect( factory.create.getCall(0).args[2] )
                .to.eql( {b: 2} );
        });

    });

    describe('define', function() {

        beforeEach(function() {
            factory('test1');
            cool.test1.define('hello');

            this.hello = cool.test1._ctors['hello'];
        });

        it('should throw if no name passed', function() {
            expect( function() { cool.test1.define(); } )
                .to.throwError();
        });

        it('should throw if already defined', function() {

            expect( function() { cool.test1.define('hello'); } )
               .to.throwError();
        });

        it('should store new ctor', function() {

            expect( this.hello ).to.be.a( Function );
        });

        it('new objects should be instances of `type`', function() {

            expect( new this.hello() ).to.be.a( cool.test1 );
        });

        it('new objects should be instances of cool', function() {

            expect( new this.hello() ).to.be.a( cool );
        });

        it('should extend set prototype of `type`', function() {
            cool.test1.prototype = {a: 1};
            cool.test1.define('hello2', {b: 2});

            var proto = cool.test1._ctors.hello2.prototype;

            expect( proto ).to.have.property( 'a', 1 );
        });

        it('should extend prototype of `type`', function() {
            cool.test1.prototype = {a: 1};
            cool.test1.define('hello2', {b: 2});

            var proto = cool.test1._ctors.hello2.prototype;

            expect( proto ).to.have.property('a', 1);
            expect( proto ).to.have.property('b', 2);
        });

        it('should return cool', function() {

            expect( cool.test1.define('hello2') )
                .to.eql( cool );
        });
    });

    describe('create', function() {

        beforeEach(function() {
            factory.events.test1 = sinon.spy();
            factory('test1', {
                init: function() { return this; }
            });
            sinon.spy(cool.test1.prototype, 'init');
            cool.test1.define('hello');
        });

        it('should throw if `type` is not defined', function() {

            expect( function() { cool.test1.create('hello2'); } )
                .to.throwError( );
        });

        it('should store first instance', function() {
            cool.test1.create('hello');

            expect( cool.test1._insts['hello'][0] ).to.be.a( cool );
        });

        it('should call events init for instance', function() {
            var inst = cool.test1.create('hello');

            expect( factory.events.test1.calledOnce ).to.be.ok();
            expect( factory.events.test1.getCall(0).args )
                .to.eql( [inst] );
        });

        it('should call `events.init` before `inst.init`', function() {
            cool.test1.create('hello');
            var instInit = cool.test1.prototype.init;
            var eventInit = factory.events.test1;

            expect( eventInit.calledBefore(instInit) )
                .to.be.ok();
        });

        it('should store one more instance instance', function() {
            cool.test1._insts['hello'] = [123];
            cool.test1.create('hello');

            expect( cool.test1._insts['hello'][1] ).to.be.a( cool );
        });

        it('should call `init` with params', function() {
            cool.test1.create('hello', {a: 1});

            expect( cool.test1.prototype.init.calledOnce ).to.be.ok();
            expect( cool.test1.prototype.init.getCall(0).args[0] )
                .to.eql( {a: 1} );
        });

        it('should call `init` with data', function() {
            cool.test1.create('hello', {a: 1}, {b: 2});

            expect( cool.test1.prototype.init.calledOnce ).to.be.ok();
            expect( cool.test1.prototype.init.getCall(0).args[1] )
                .to.eql( {b: 2} );
        });

        it('should return instance', function() {

            expect( cool.test1.create('hello') )
                .to.be.a( cool.test1 );
        });

    });

});
