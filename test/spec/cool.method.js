
describe('cool.method', function() {

    var method = cool.method;

    beforeEach(function() {
        var aim = this.aim = {};
        aim.extend(cool.events);

        aim.tested = 0;
        aim.test = method('test', function() {
            this.tested++;
            return 10;
        });

        aim.async = method('async', function() {
            var promise = cool.promise();
            setTimeout(function() {
                aim.resolved = true;
                promise.resolve(20);
            }, 20);
            return promise;
        });
    });

    it('should run action in the aim context', function(done) {
        var aim = this.aim;

        aim.ctx = method('ctx', function() {
            expect( this ).to.eql( aim );
            done();
        });

        aim.ctx();
    });

    it('should pass action\'s arguments', function(done) {
        var aim = this.aim;

        aim.args = method('args', function(a, b) {
            expect( a ).to.eql( {v: 20} );
            expect( b ).to.eql( 30 );
            done();
        });

        aim.args({v: 20}, 30);

    });

    it('should return action\'s result', function() {

        expect( this.aim.test() ).to.eql( 10 );
    });

    it('should emit before `action`', function(done) {
        this.aim.on('test', function() {

            expect( this.tested ).to.eql( 0 );
            done();
        });

        this.aim.test();
    });

    it('should emit after `action`', function(done) {
        this.aim.on('tested', function() {

            expect( this.tested ).to.eql( 1 );
            done();
        });

        this.aim.test();
    });

    it('should prevent `action` by preventDefault', function() {
        this.aim.on('test', function(evt) {
            evt.preventDefault();
        });

        this.aim.test();

        expect( this.aim.tested ).to.eql( 0 );
    });

    it('should perfom action while emit', function() {
        this.aim.on('test', function(evt) {
            evt.preventDefault();
            evt.action();
        });

        this.aim.test();

        expect( this.aim.tested ).to.eql( 1 );
    });

    it('should emit with action reply', function(done) {
        this.aim.on('tested', function(evt, data) {

            expect( data ).to.eql( 10 );
            done();
        });

        this.aim.test();
    });

    it('should emit when promise resolved', function(done) {

        this.aim.on('asynced', function() {
            expect( this.resolved ).to.eql( true );
            done();
        });

        this.aim.async();
    });

    it('should emit with promise resolution', function(done) {

        this.aim.on('asynced', function(evt, data) {
            expect( data ).to.eql( 20 );
            done();
        });

        this.aim.async();
    });

    describe('bindAction', function() {

        it('should return function', function() {
            expect( method.bindAction() ).to.be.a( Function );
        });

        it('should call action only once', function() {
            var action = sinon.spy();
            var binded = method.bindAction(action);

            binded(); binded(); binded();

            expect( action.calledOnce ).to.be.ok();
        });

        it('should return action `reply` every time', function() {
            var action = function() { return 123; };
            var binded = method.bindAction(action);

            expect( binded() ).to.eql( 123 );
            expect( binded() ).to.eql( 123 );
        });

        it('should call in specified context', function(done) {
            var ctx = {a: 1};
            var action = function() {

                expect( this ).to.eql( ctx );
                done();
            };

            method.bindAction(action, ctx) ();
        });

        it('should call with specified arguments', function(done) {
            var args = [{v: 1}, 14];
            var action = function(a, b) {

                expect( a ).to.eql( {v: 1} );
                expect( b ).to.eql( 14 );
                done();
            };

            method.bindAction(action, null, args) ();
        });

    });

    describe('extend', function() {

        it('should set of methods', function() {
            var dest = {};

            method.extend(dest, {
                'hello': function() {},
                'bye': function() {}
            });

            expect( dest.hello ).to.be.a( Function );
            expect( dest.bye ).to.be.a( Function );
        });

        it('should be called by method', function() {
            var dest = {};
            var props = {t1: function() {}, t2: function() {}};
            sinon.spy(method, 'extend');

            method(dest, props);

            expect( method.extend.calledOnce ).to.be.ok();
            expect( method.extend.getCall(0).args )
                .to.eql( [dest, props] );

            method.extend.restore();
        });

    });
});
