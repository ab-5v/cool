
describe('cool.view', function() {

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

});
