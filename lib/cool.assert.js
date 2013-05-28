;(function(cool) {

var assert = function(cond, msg) {
    if (cond) { return; }

    var args = xtnd.array(arguments).slice(2);

    throw new Error( cool.assert.msg(msg, args) );
};

assert.re = /(%(\d))/g;

assert.msg = function(msg, args) {
    msg = msg || 'unknown error';

    msg = msg.replace(assert.re, function(a, b, index) {
        return args[index - 1];
    });

    msg = msg.charAt(0).toUpperCase() + msg.substr(1);

    return msg;
};

cool.assert = assert;

})(cool);
