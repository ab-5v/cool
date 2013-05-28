describe('cool.assert', function() {
    var assert = cool.assert;

    it('should return defualt error', function() {
        expect( assert.msg() ).to.eql( 'Unknown error' );
    });

    it('should uppercase msg', function() {
        expect( assert.msg('error') ).to.eql( 'Error' );
    });

    it('should replace placeholders', function() {
        expect( assert.msg('%1 has %2 type %3', ['el', 3, 'none']) )
            .to.eql( 'El has 3 type none' );
    });

    it('should return immediately on truthy value', function() {
        expect( assert( 1 ) ).to.eql( undefined );
    });

    it('should throw on falsy value', function() {
        expect( function() { assert(0, 'Err #%1-%2', 3, 5); } ).to.throwError(/Err #3-5/);
    });

});

