describe('store', function() {

    beforeEach(function() {
        this.aim = {};
        xtnd(this.aim, cool.events, cool.store('data'));
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

    it('should return before/after for data({})', function() {
        this.aim.data({a: 3});

        expect( this.aim.data({b: 2}) )
            .to.eql( {before: {a: 3}, after: {b: 2}} );
    });

    it('should return before/after for data(true, {})', function() {
        this.aim.data({a: 3});

        expect( this.aim.data(true, {b: 2}) )
            .to.eql( { before: {}, after: {b: 2} });
    });

    it('should return before/after for data(name, value)', function() {
        this.aim.data({a: 3});

        expect( this.aim.data('a', 4) )
            .to.eql( {before: {a: 3}, after: {a: 4}} );
    });

    it('should return before/after for data(true, name, value)', function() {
        this.aim.data({a: [1, 2]});

        expect( this.aim.data(true, 'a', 3) )
            .to.eql( {before: {a: [1, 2]}, after: {a: [1, 2, 3]}} );
    });

    it('should return before/after for data(false)', function() {
        this.aim.data({a: 1});

        expect( this.aim.data(false) )
            .to.eql( {before: {a: 1}, after: {}} );
    });

    it('should return before/after for data(false, name)', function() {
        this.aim.data({a: 1, b: 2});

        expect( this.aim.data(false, 'b') )
            .to.eql( {before: {b: 2}, after: {}} );
    });

    it('should return before/after for data(false, name, value)', function() {
        this.aim.data({a: [1, 2, 3]});

        expect( this.aim.data(false, 'a', 2) )
            .to.eql( {before: {a: [1, 2, 3]}, after: {a: [1, 3]}} );
    });

    it('should emit on data write', function() {
        sinon.spy(this.aim, 'emit');

        this.aim.data({a: 1});

        expect( this.aim.emit.calledTwice ).to.be.ok();
    });

    it('should not emit on data read', function() {
        sinon.spy(this.aim, 'emit');

        this.aim.data();
        this.aim.data('foo');

        expect( this.aim.called ).not.to.be.ok();
    });

    it('should throw on wrong format', function() {
        var aim = this.aim;

        expect( function() { aim.data(false, {}); } )
            .to.throwError(/unsupported arguments/i);
    });

});
