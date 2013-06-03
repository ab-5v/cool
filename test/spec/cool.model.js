describe('cool.model', function() {

    describe('init', function() {

        beforeEach(function() {
            this.model = new cool.model();
            this.model.url = '/test';
        });

        it('should throw if no url specified', function() {
            var model = new cool.model();

            expect( function() { model.init(); } )
                .to.throwError();
        });

        it('should set data', function() {
            this.model.init({}, {a: 1});

            expect( this.model.data() ).to.eql( {a: 1} );
        });

        it('should set params', function() {
            this.model.init({b: 2}, {});

            expect( this.model.param() ).to.eql( {b: 2} );
        });

        it('should return `this`', function() {

            expect( this.model.init({}, {}) ).to.eql( this.model );
        });

    });

    describe('fetch', function() {

        beforeEach(function() {

            var requests = this.requests = [];

            this.xhr = sinon.useFakeXMLHttpRequest();
            this.xhr.onCreate = function (xhr) {
                requests.push(xhr);
                setTimeout(function() {
                    xhr.respond(200,
                        { 'Content-Type': 'application/json' },
                        '{ "user": "artjock" }'
                    );
                }, 10);
            };

            this.model = new cool.model({a: 1}, {b: 2});
            this.model.url = '/test';
        });

        afterEach(function() {
            this.xhr.restore();
        });

        it('should call server once', function() {
            this.model.fetch();

            expect( this.requests.length ).to.eql( 1 );
        });

        it('should call server with `this.url`', function() {
            this.model.fetch();

            expect( this.requests[0].url ).to.eql( '/test' );
        });

        it('should call server with "GET" method', function() {
            this.model.fetch();

            expect( this.requests[0].method ).to.eql( 'GET' );
        });

        it('should return promise', function() {
            expect( cool.promise.is( this.model.fetch() ) ).to.be.ok();
        });

        it('should resolve with model', function(done) {
            var model = this.model;

            model.fetch()
                .then(function(res) {
                    expect( res ).to.equal( model );
                    done();
                });
        });

        it('should save returned data', function(done) {
            var model = this.model;

            model.fetch()
                .then(function() {
                    expect( model.data() ).to.eql( {user: 'artjock'} );
                    done();
                });
        });

        it('should emit with model', function(done) {
            var model = this.model;

            model.on('fetched', function(evt, res) {
                expect( res ).to.equal( model );
                done();
            });

            model.fetch();
        });

    });

});
