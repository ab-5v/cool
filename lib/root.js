;(function(root) {

require('util.js');

var cool = root.cool = function() {};

cool.util = util;

cool.promise = pzero;

require('view.js');
require('model.js');

})(this, undefined);
