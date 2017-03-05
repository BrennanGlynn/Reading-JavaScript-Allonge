function memoized(fn, keymaker) {
    var lookup = {},
        key;

    keymaker || (keymaker = function (args) {
        return JSON.stringify(args);
    });

    return function () {
        var key = keymaker.call(this, arguments);

        return lookup[key] || (lookup[key] = fn.apply(this, arguments));
    };
}

var fibonacci = function (n) {
    if (n < 2) {
        return n;
    } else {
        return fibonacci(n-2) + fibonacci(n-1);
    }
};

var fastFibonacci = memoized( function (n) {
    if (n < 2) {
        return n;
    } else {
        return fastFibonacci(n-2) + fastFibonacci(n-1);
    }
});

s = (new Date()).getTime();
console.log(fibonacci(45));
console.log(((new Date()).getTime() - s) / 1000);

s = (new Date()).getTime();
console.log(fastFibonacci(45));
console.log(((new Date()).getTime() - s) / 1000);