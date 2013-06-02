;(function(root) {
    var cool = function() {};

    cool.promise = pzero;

    /* borschik:include:./cool.store.js */
    /* borschik:include:./cool.assert.js */
    /* borschik:include:./cool.events.js */
    /* borschik:include:./cool.method.js */
    /* borschik:include:./cool.factory.js */

    xtnd(cool.prototype,
        cool.events,
        cool.store('data'),
        cool.store('param')
    );

    /* borschik:include:./cool.view.js */
    /* borschik:include:./cool.model.js */

    root.cool = cool;
})(this);
