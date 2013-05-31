describe('cool.view.init', function() {

    var init= cool.view.init;

    beforeEach(function() {

        this.to = function(ms, val) {
            var promise = cool.promise();
            setTimeout(function() {
                val.data({t: ms});
                promise.resolve(val);
            }, ms);
            return promise;
        };

        this.view = new cool.view();
        this.view.data({a: 1});
        this.view.params({b: 2});
    });

    afterEach(function() {
        cool.view._insts = {};
        cool.view._ctors = {};
        cool.model._insts = {};
        cool.model._ctors = {};

    });

    describe('views', function() {

        beforeEach(function() {
            var to = this.to;

            cool.view({name: 'v1'});
            cool.view({name: 'v2'});
            cool.view({name: 'async', models: ['async']});

            cool.model({
                name: 'async',
                url: '/test',
                fetch: function() { return to(10, this); }
            });

            this.view.views = ['v1', 'v2'];

            sinon.stub(this.view, 'append');
            sinon.spy(cool, 'view');
        });

        afterEach(function() {
            cool.view.restore();
        });

        it('should create specified views', function() {
            init.views(this.view);

            expect( cool.view.calledTwice ).to.be.ok();

            expect( cool.view.returnValues[0] ).to.be.a( cool.view );
            expect( cool.view.returnValues[0].name ).to.be( 'v1' );
            expect( cool.view.returnValues[1] ).to.be.a( cool.view );
            expect( cool.view.returnValues[1].name ).to.be( 'v2' );
        });

        it('should store created views', function() {
            init.views(this.view);

            expect( this.view._views['v1'].name ).to.be( 'v1' );
            expect( this.view._views['v2'].name ).to.be( 'v2' );
        });

        it('should pass params to each view', function() {
            init.views(this.view);

            expect( this.view._views['v1'].params() ).to.eql( {b: 2} );
            expect( this.view._views['v2'].params() ).to.eql( {b: 2} );
        });

        it('should pass data to each view', function() {
            init.views(this.view);

            expect( this.view._views['v1'].data() ).to.eql( {a: 1} );
            expect( this.view._views['v2'].data() ).to.eql( {a: 1} );
        });

        it('should bind on `rendered` when element not ready', function() {
            this.view.views = ['async'];
            init.views(this.view);

            expect( this.view._views['async']._events['rendered'].length )
                .to.eql(1);
        });

        it('should call `append` when subview `rendered`', function() {
            init.views(this.view);

            expect( this.view.append.calledTwice ).to.be.ok();
            expect( this.view.append.getCall(0).args[0] )
                .to.eql( this.view._views['v1'] );
            expect( this.view.append.getCall(1).args[0] )
                .to.eql( this.view._views['v2'] );
        });

        it('should call `append` for async subview', function(done) {
            var view = this.view;
            view.views = ['async'];
            init.views(view);

            setTimeout(function() {
                expect( view.append.calledOnce ).to.be.ok();
                expect( view.append.getCall(0).args[0] )
                    .to.eql( view._views['async'] );
                done();
            }, 10);
        });

    });

    describe('models', function() {

        beforeEach(function() {
            var to = this.to;

            cool.model({
                name: 'a1', url: '/test',
                fetch: function() { return to(10, this); }
            });

            cool.model({
                name: 'a2', url: '/test',
                fetch: function() { return to(20, this); }
            });

            this.view.models = ['a1', 'a2'];

            sinon.spy(cool, 'model');
        });

        afterEach(function() {
            cool.model.restore();
        });

        it('should create specified models', function() {
            init.models(this.view);

            expect( cool.model.calledTwice ).to.be.ok();

            expect( cool.model.returnValues[0] ).to.be.a( cool.model );
            expect( cool.model.returnValues[0].name ).to.be( 'a1' );
            expect( cool.model.returnValues[1] ).to.be.a( cool.model );
            expect( cool.model.returnValues[1].name ).to.be( 'a2' );
        });

        it('should store specified models', function() {
            init.models(this.view);

            expect( this.view.models['a1'].name ).to.be( 'a1' );
            expect( this.view.models['a2'].name ).to.be( 'a2' );
        });

        it('should pass params to each model', function() {
            init.models(this.view);

            expect( this.view.models['a1'].params() ).to.eql( {b: 2} );
            expect( this.view.models['a2'].params() ).to.eql( {b: 2} );
        });

        it('should pass data to each model', function() {
            init.models(this.view);

            expect( this.view.models['a1'].data() ).to.eql( {a: 1} );
            expect( this.view.models['a2'].data() ).to.eql( {a: 1} );
        });


        it('should call `fetch` for each model', function() {
            sinon.stub(cool.model.prototype, 'fetch');
            cool.model({name: 't', url: '/'});
            this.view.models = ['t'];
            init.models(this.view);

            expect( cool.model.prototype.fetch.calledOnce ).to.be.ok();

            cool.model.prototype.fetch.restore();
        });

        it('should return promise', function() {
            expect( cool.promise.is(init.models(this.view)) ).to.be.ok();
        });

        it('should resolve, when all models are fetched', function(done) {
            var view = this.view;

            init.models(view)
                .then(function() {

                    expect( view.models['a1'].data() ).to.eql( {t: 10} );
                    expect( view.models['a2'].data() ).to.eql( {t: 20} );
                    done();
                });
        });


    });

});
