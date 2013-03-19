var util = cool.util;

describe('util', function() {

    describe('keys', function() {

        it('should return keys of object', function() {
            expect( util.keys({a: 1, b: 2, c: 3}) ).to.eql(['a', 'b', 'c']);
        });

        it('should return empty array on empty object', function() {
            expect( util.keys({}) ).to.eql([]);
        });

    });

    describe('extend', function() {

        it('should extend empty object with one object', function() {
            expect( util.extend({}, {a: 1, b: 2}) ).to.eql( {a: 1, b: 2} );
        });

        it('should extend object with one object', function() {
            expect( util.extend({a: 1}, {b: 2}) ).to.eql( {a: 1, b: 2} );
        });

        it('should owervrite object while extending', function() {
            var obj = {a: 1};
            util.extend(obj, {b: 2});

            expect( obj ).to.eql( {a: 1, b: 2} );
        });

        it('should extend object with few objects', function() {
            expect( util.extend({a: 1}, {b: 2}, {c: 3}) ).to.eql( {a: 1, b: 2, c: 3} );
        });

        it('should properties of object', function() {
            expect( util.extend({a: 1}, {a: 2}, {a: 3}) ).to.eql( {a: 3} );
        });

    });

    describe('toObject', function() {

        it('should return object on array', function() {
            expect( util.toObject(['a', 'b']) ).to.eql( {a: 1, b: 1} );
        });

        it('should return empty object on empty array', function() {
            expect( util.toObject([]) ).to.eql( {} );
        });

    });
});
