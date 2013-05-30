describe('cool.view.init', function() {

    var init = cool.view.init;

    describe('views', function() {

        beforeEach(function() {
            cool.view({name: 'v1'});
            cool.view({name: 'v2'});

            this.view = new cool.view();
            this.view.data({a: 1});
            this.view.params({b: 2});
            this.view.views = ['v1', 'v2'];

            sinon.spy(cool, 'view');
            sinon.spy(this.view, 'append');
        });

        afterEach(function() {
            cool.view.restore();

            cool.view._insts = {};
            cool.view._ctors = {};

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

        it('should bind on `rendered` event', function() {
            init.views(this.view);

            expect( this.view.views['v1']._events['rendered'].length )
                .to.eql(1);
        });

        it('should call `append` when subview `rendered`', function() {
            init.views(this.view);

            //expect( this.view.append.calledOnce ).to.be.ok();
        });

    });

});
