var _ = require('underscore');
var map = _.map;

var inventories = [
    {apples:0, oranges: 144, eggs:36},
    {apples:240, oranges: 54, eggs:12},
    {apples:24, oranges: 12, eggs:42}
];

function compose (a, b) {
    return function (c) {
        return a(b(c));
    }
}

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

function getWith (attr) {
    return function (object) {
        return object[attr];
    }
}

var pluckWith = compose(mapWith, getWith);

console.log(pluckWith('eggs')(inventories));