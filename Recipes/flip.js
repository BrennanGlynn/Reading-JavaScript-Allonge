// Let’s consider the case whether we have a map function of our own, perhaps from the
// allong.es library, perhaps from Underscore.
var _ = require('underscore');
var map = _.map;

function flip (fn) {
    return function (first, second) {
        if (arguments.length === 2) {
            return fn.call(this, second, first);
        } else {
            return function (second) {
                return fn.call(this, second, first);
            }
        }
    };
};

var mapWith = flip(map);

var square = function (n) {
    return n * n;
};

console.log(mapWith(square,[1, 2, 3, 4, 5]));
// => [1, 4, 9, 16, 25]

var convert = mapWith(function (c) {
    return String.fromCharCode(c);
});

console.log(convert([72, 69, 76, 76, 79]).join(""));
// => HELLO

// Now you can call mapWith(fn, list) or mapWith(fn)(list), your choice.


