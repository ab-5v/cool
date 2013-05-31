
describe('cool.view', function() {

    beforeEach(function() {
        cool.view({name: 'v1'});
        cool.view({name: 'v2'});
    });

    afterEach(function() {
        cool.view._insts = {};
        cool.view._ctors = {};
    });

    describe('init', function() {

        var init = cool.view.init;

        beforeEach(function() {
            this.view = new cool.view();

            sinon.spy(init, 'views');
            sinon.spy(init, 'models');
        });

        afterEach(function() {
            init.views.restore();
            init.models.restore();

            cool.view._insts = {};
            cool.view._ctors = {};
        });

        it('should set params', function() {
            this.view.init({a: 1}, {});

            expect( this.view.params() ).to.eql( {a: 1} );
        });

        it('should set data', function() {
            this.view.init({}, {b: 2});

            expect( this.view.data() ).to.eql( {b: 2} );
        });

        it('should call `init.views`', function() {
            this.view.init({}, {});

            expect( init.views.calledOnce ).to.be.ok();
            expect( init.views.getCall(0).args[0])
                .to.eql( this.view );
        });

        it('should call `init.models`', function() {
            this.view.init({}, {});

            expect( init.models.calledOnce ).to.be.ok();
            expect( init.models.getCall(0).args[0])
                .to.eql( this.view );
        });

        it('should call `render` immediately w/o models', function() {
            sinon.spy(this.view, 'render');
            this.view.init({}, {});

            expect( this.view.render.calledOnce ).to.be.ok();
        });

        it('should return this', function() {

            expect( this.view.init({}, {}) ).to.eql( this.view );
        });


    });

    describe('toJSON', function() {

        beforeEach(function() {
            this.view = new cool.view();
        });

        it('should return all json of the view', function() {
            this.view.data({a: 1});
            this.view.params({b: 2});

            expect( this.view.toJSON() ).to.eql( {
                data: {a: 1},
                params: {b: 2}
            } );
        });

    });

    describe('render', function() {

        beforeEach(function() {
            this.view = new cool.view();
            this.view.params('a');
            this.view.html = function(json) {
                return '<i>' + json.params + '</i><b>123</b>';
            };
            sinon.spy(this.view, 'html');
            sinon.spy(this.view, 'toJSON');
        });

        it('should ensure element', function() {
            this.view.render();

            expect( this.view.el.length ).to.eql( 1 );
        });

        it('should call "html"', function() {
            this.view.render();

            expect( this.view.html.calledOnce ).to.be.ok();
        });

        it('should call "toJSON"', function() {
            this.view.render();

            expect( this.view.toJSON.calledOnce ).to.be.ok();
        });

        it('should call "html" with "toJSON" data', function() {
            this.view.render();

            expect( this.view.toJSON.returnValues[0] )
                .to.eql( this.view.html.getCall(0).args[0] );
        });

        it('should set get first root element', function() {
            this.view.render();

            expect( this.view.el[0].tagName.toLowerCase() ).to.eql( 'i' );
        });

        it('should replace only content of element', function() {
            this.view.render();

            var el = this.view.el[0];

            this.view.params('b');
            this.view.render();

            expect( this.view.el[0] ).to.eql( el );
            expect( this.view.el.html() ).to.eql( 'b' );
        });

    });

    describe('append', function() {

        beforeEach(function() {
            this.view = cool.view('v1');
            this.v201 = cool.view('v2');
            this.v202 = cool.view('v2');
        });

        it('should ensure specified store', function() {
            this.view.append(this.v201);

            expect( this.view._views['v2'] ).to.be.an( Array );
        });

        it('should add subviews to store', function() {
            this.view.append(this.v201);
            this.view.append(this.v202);

            expect( this.view._views['v2'] )
                .to.eql( [this.v201, this.v202] );
        });

        it('should call `detach` if subview has parent', function() {
            this.v201.append(this.v202);
            sinon.spy(this.v202, 'detach');
            this.view.append(this.v202);

            expect( this.v202.detach.calledOnce ).to.be.ok();
            expect( this.v202.detach.getCall(0).args[0] ).to.eql( true );
        });

        it('should not call `detach` if subview has no parent', function() {
            sinon.spy(this.v202, 'detach');
            this.view.append(this.v202);

            expect( this.v202.detach.called ).not.to.be.ok();
        });

        it('should set `_parent` of subview', function() {
            this.view.append(this.v202);

            expect( this.v202._parent ).to.eql( this.view );
        });

        it('should append dom element', function() {
            this.view.append(this.v202);

            expect( this.view.el.find( this.v202.el ).length ).to.eql( 1 );
        });

    });

    describe('detach', function() {

        beforeEach(function() {
            this.view = cool.view('v1');
            this.v201 = cool.view('v2');
            this.v202 = cool.view('v2');

            this.view.append(this.v201);
            this.view.append(this.v202);
        });

        it('should remove view from subviews store', function() {
            this.v202.detach();

            expect( this.view._views['v2'] ).to.eql( [this.v201] );
        });

        it('should throw on view w/o parent', function() {
            var view = this.view;

            expect( function() { view.detach(); } )
                .to.throwError(/_parent/);
        });

        it('should leave empty array after detaching last', function() {
            this.v201.detach();
            this.v202.detach();

            expect( this.view._views['v2'] ).to.eql( [] );
        });

        it('should remove `_parent` link', function() {
            this.v201.detach();

            expect( this.v201 ).not.to.have.property( '_parent' );
            expect( this.v202 ).to.have.property( '_parent' );
        });

        it('should detach dom by default', function() {
            this.v201.detach();

            expect( this.view.el.find( this.v201.el ).length ).to.eql( 0 );
            expect( this.view.el.find( this.v202.el ).length ).to.eql( 1 );
        });

        it('should not detach dom with `skipDom`', function() {
            this.v201.detach(true);

            expect( this.view.el.find( this.v201.el ).length ).to.eql( 1 );
            expect( this.view.el.find( this.v202.el ).length ).to.eql( 1 );
        });

    });

});
