// Use mapWith to turn a function into a mapping

function mapWith(fn) {
    return function (list) {
        return Array.prototype.map.call(list, function (something) {
            return fn.call(this, something);
        });
    };
};

var squareMap = mapWith(function (n) {
    return n * n;
});

var convertToLetter = mapWith(function (n) {
    return String.fromCharCode(n)
});

console.log(squareMap([1, 2, 3, 4, 5]));
// => [1, 4, 9, 16, 25]

console.log(convertToLetter([72, 69, 76, 76, 79]).join(""));
// => Hello