describe('cool.view.init', function() {

    var init = cool.view.init;

    describe('views', function() {

        beforeEach(function() {
            cool.view({name: 'v1'});
            cool.view({name: 'v2'});
            cool.view({name: 'async', models: ['async']});

            cool.model({
                name: 'async',
                url: '/test',
                fetch: function() {
                    var t = this;
                    var p = pzero();
                    setTimeout(function() { p.resolve(t); }, 10);
                    return p;
                }
            });

            this.view = new cool.view();
            this.view.data({a: 1});
            this.view.params({b: 2});
            this.view.views = ['v1', 'v2'];

            sinon.spy(cool, 'view');
        });

        afterEach(function() {
            cool.view.restore();

            cool.view._insts = {};
            cool.view._ctors = {};
            cool.model._insts = {};
            cool.model._ctors = {};

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

            expect( this.view.views['v1'].name ).to.be( 'v1' );
            expect( this.view.views['v2'].name ).to.be( 'v2' );
        });

        it('should pass params to each view', function() {
            init.views(this.view);

            expect( this.view.views['v1'].params() ).to.eql( {b: 2} );
            expect( this.view.views['v2'].params() ).to.eql( {b: 2} );
        });

        it('should pass data to each view', function() {
            init.views(this.view);

            expect( this.view.views['v1'].data() ).to.eql( {a: 1} );
            expect( this.view.views['v2'].data() ).to.eql( {a: 1} );
        });

        it('should bind on `rendered` when element not ready', function() {
            this.view.views = ['async'];
            init.views(this.view);

            expect( this.view.views['async']._events['rendered'].length )
                .to.eql(1);
        });

        it('should call `append` when subview `rendered`', function() {
            sinon.spy(this.view, 'append');
            init.views(this.view);

            expect( this.view.append.calledTwice ).to.be.ok();
            expect( this.view.append.getCall(0).args[0] )
                .to.eql( this.view.views['v1'] );
            expect( this.view.append.getCall(1).args[0] )
                .to.eql( this.view.views['v2'] );
        });

        it('should call `append` for async subview', function(done) {
            var view = this.view;
            view.views = ['async'];
            sinon.spy(view, 'append');
            init.views(view);

            setTimeout(function() {
                expect( view.append.calledOnce ).to.be.ok();
                expect( view.append.getCall(0).args[0] )
                    .to.eql( view.views['async'] );
                done();
            }, 10);
        });

    });

});
