describe('store', function() {

    beforeEach(function() {
        this.aim = {};
        xtnd(this.aim, cool.store('data'));
        this.aim._data = {};
    });

    it('should construct store', function() {
        var store = cool.store('data');

        expect( store ).to.be.an( Object );
        expect( store.data ).to.be.a( Function );
    });

    it('should work for `data({})`', function() {
        this.aim.data( {a: 1} );
        this.aim.data( {b: 2} );

        expect( this.aim._data ).to.eql( {b: 2} );
    });

    it('should work for `data(true, {})`', function() {
        this.aim.data( {a: 1} );
        this.aim.data( true, {b: 2} );

        expect( this.aim.data() ).to.eql( {a: 1, b: 2} );
    });

    it('should work for `data(name, value)`', function() {
        this.aim.data('a', 2);

        expect( this.aim.data() ).to.eql( {a: 2} );
    });

    it('should work for `data(true, name, value)`', function() {
        this.aim.data({a: [1, 2]});
        this.aim.data(true, 'a', 3);

        expect( this.aim.data() ).to.eql( {a: [1, 2, 3]} );
    });

    it('should work for `data(false)`', function() {
        this.aim.data({a: 1});
        this.aim.data(false);

        expect( this.aim.data() ).to.eql( {} );
    });

    it('should work for `data(false, name)`', function() {
        this.aim.data({a: 1, b: 2});
        this.aim.data(false, 'a');

        expect( this.aim.data() ).to.eql( {b: 2} );
    });

    it('should work for `data(false, name, value)`', function() {
        this.aim.data({a: [1, 2, 3]});
        this.aim.data(false, 'a', 2);

        expect( this.aim.data() ).to.eql( {a: [1, 3]} );
    });

    it('should work for `data()`', function() {
        this.aim.data({b: 2});

        expect( this.aim.data() ).to.eql( {b: 2} );
    });

    it('should work for `data(name)`', function() {
        this.aim.data({a: 3});

        expect( this.aim.data('a') ).to.eql( 3 );
    });

});
