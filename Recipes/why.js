// Enables you to make recursive functions without needing to bind a function to a name in an environment
var print = console.log;

function Y (f) {
    return ((function (x) {
        return f(function (v) {
            return x(x)(v);
        });
    })(function (x) {
        return f(function (v) {
            return x(x)(v);
        });
    }));
}

var factorial = Y(function (fac) {
    return function (n) {
        return (n == 0 ? 1 : n * fac(n - 1));
    };
});

var sumOfAll = Y(function (fn) {
    return function (n) {
        return (n == 1 ? 1 : n + fn(n - 1))
    }
});

print(factorial(5));
print(sumOfAll(5));