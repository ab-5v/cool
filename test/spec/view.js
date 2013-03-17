describe('view', function() {

    describe('param', function() {

        before(function() { cool.view('param', {render: function() {}}); });

        beforeEach(function() {
            this.view = cool.view('param');
            this.view._param = {
                a: 1,
                b: [1, 2]
            }
        });

        it('should return param by name', function() {
            expect( this.view.param('a') ).to.eql(1);
        });

        it('should return all params', function() {
            expect( this.view.param() ).to.eql(this.view._param);
        });

        it('should remove value form set', function() {
            this.view.param(false, 'b', 2);

            expect( this.view._param.b ).to.eql([1]);
        });

        it('should remove param', function() {
            this.view.param(false, 'b');

            expect( this.view._param.b ).to.eql(undefined);
        });

        it('should clear all params', function() {
            this.view.param(false);

            expect( this.view._param ).to.eql({});
        });

        it('should add param', function() {
            this.view.param('c', 3);

            expect( this.view._param.c ).to.eql(3);
        });

        it('should overwrite param', function() {
            this.view.param('b', 4);

            expect( this.view._param.b ).to.eql(4);
        });

        it('should append param', function() {
            this.view.param(true, 'b', 7);

            expect( this.view._param.b ).to.eql([1,2,7]);
        });

        it('should append to not existing set', function() {
            this.view.param(true, 'c', 9);

            expect( this.view._param.c ).to.eql([9]);
        });

    });
});
