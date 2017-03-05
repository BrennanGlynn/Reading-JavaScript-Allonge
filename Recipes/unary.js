// Use this to send an array as a single argument
function unary(fn) {
    if (fn.length == 1) {
        return fn;
    } else return function (something) {
        return fn.call(this, something)
    }
}

// returns [1, NaN, NaN]
console.log(['1','2','3'].map(parseInt));

// return [1, 2, 3]
console.log(['1','2','3'].map(unary(parseInt)));