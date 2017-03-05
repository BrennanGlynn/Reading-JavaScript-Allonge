// Can use to loop through objects and grabbing values from an attribute

d = console.log;

function getWith (attr) {
    return function (object) {
        return object[attr];
    }
}

function mapWith(fn) {
    return function (list) {
        return Array.prototype.map.call(list, function (something) {
            return fn.call(this, something);
        });
    };
};

var inventory = {
    apples: 0,
    oranges: 144,
    eggs: 36
};

d(getWith('oranges')(inventory));


var inventories = [
    {apples:0, oranges: 144, eggs:36},
    {apples:240, oranges: 54, eggs:12},
    {apples:24, oranges: 12, eggs:42}
];

d(mapWith(getWith('oranges'))(inventories));

