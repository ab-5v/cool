describe('store', function() {

    beforeEach(function() {
        this.aim = {};
        xtnd(this.aim, cool.store('data'));
    });

    it('should return object', function() {
        var store = cool.store('data');

        expect( store ).to.be.an( Object );
        expect( store.data ).to.be.a( Function );
    });

    it('should set data', function() {
        this.aim.data( {a: 1} );

        expect( this.aim._data ).to.eql( {a: 1} );
    });

    it('should return data', function() {
        this.aim._data = {b: 2};

        expect( this.aim.data() ).to.eql( {b: 2} );
    });

});
