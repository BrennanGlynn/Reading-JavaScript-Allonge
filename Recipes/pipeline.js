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
}

var pipeline = flip(compose);
 /*
Comparing pipeline to compose, pipeline says “add one to the number and then double it.”
Compose says, “double the result of adding one to the number.” Both do the same job, but
communicate their intention in opposite ways.
*/