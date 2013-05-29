
describe('cool.view', function() {

    describe('element', function() {

        beforeEach(function() {
            this.view = new cool.view();
            this.view.params = 'a';
            this.view.render = function(params) {
                return '<i>' + params + '</i>'
                    + '<b>' + 123 + '</b>';
            };
        });

        it('should ensure element', function() {
            this.view.element();

            expect( this.view.el.length ).to.eql( 1 );
        });

        it('should set get first root element', function() {
            this.view.element();

            expect( this.view.el[0].tagName.toLowerCase() ).to.eql( 'i' );
        });

        it('should replace only content of element', function() {
            this.view.element();

            var el = this.view.el[0];

            this.view.params = 'b';
            this.view.element();

            expect( this.view.el[0] ).to.eql( el );
            expect( this.view.el.html() ).to.eql( 'b' );
        });

    });

});
