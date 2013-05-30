describe('view', function() {
    /* global before */

    describe('param', function() {
        before(function() {
            cool.view({name: 'param', render: function() {}});
        });

        beforeEach(function() {
            this.view = cool.view('param');
            this.view._param = {
                a: 1,
                b: [1, 2]
            };
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

        it('should trigger on param set with correct type and owner',
        function(done) {
            this.view.on('param', function(e) {
                expect( e.type ).to.eql('param');
                expect( e.owner ).to.eql(this.view);
                done();
            }.bind(this));
            this.view.param('a', 2);
        });

    });

    describe('_eventinfo', function() {

        before(function() {
            this.info = function(event) {
                return cool.view.prototype._eventinfo(event);
            };
        });

        it('should parse \'click\'', function() {
            expect( this.info('click') ).to.eql( {type: 'click' } );
        });

        it('should parse \'param.someview\'', function() {
            expect( this.info('param.someview') )
                .to.eql( {type: 'param', owner: 'someview' } );
        });

        it('should parse \'append.someview another\'', function() {
            expect( this.info('append.someview another') )
                .to.eql( {
                    type: 'append',
                    owner: 'someview',
                    target: 'another'
                } );
        });

        it('should parse \'submit form\'', function() {
            expect( this.info('submit form') )
                .to.eql( {type: 'submit', target: 'form' } );
        });

        it('should parse \'click .b-image\'', function() {
            expect( this.info('click .b-image') )
                .to.eql( {type: 'click', target: '.b-image' } );
        });

        it('should parse \'click .js-image .b-image\'', function() {
            expect( this.info('click .js-image .b-image') )
                .to.eql( {type: 'click', target: '.js-image .b-image' } );
        });
    });
});
