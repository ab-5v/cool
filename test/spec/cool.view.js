
describe('cool.view', function() {

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
                console.log('call html');
                return '<i>' + json.params + '</i>'
                    + '<b>' + 123 + '</b>';
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
