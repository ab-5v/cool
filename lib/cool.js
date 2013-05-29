;(function(root) {
    var cool = function() {};

    cool.promise = pzero;

    /* borschik:include:./cool.assert.js */
    /* borschik:include:./cool.events.js */
    /* borschik:include:./cool.method.js */
    /* borschik:include:./cool.factory.js */

    root.cool = cool;
})(this);
