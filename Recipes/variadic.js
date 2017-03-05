var __slice = Array.prototype.slice;

// variadic collects trailing arguments into an array

// Fine print: Of course, variadic introduces an extra function call
// and may not be the best choice in a highly performance-critical
// piece of code. Then again, using arguments is considerably slower
// than directly accessing argument bindings, so if the performance
// is that critical, maybe you shouldn’t be using a variable number
// of arguments in that section.

function variadic (fn) {
    var fnLength = fn.length;

    if (fnLength < 1) {
        return fn;
    }
    else if (fnLength === 1) {
        return function () {
            return fn.call(
                this, __slice.call(arguments, 0));
        }
    }
    else {
        return function () {
            var numberOfArgs = arguments.length,
                namedArgs = __slice.call(
                    arguments, 0, fnLength - 1),
                numberOfMissingArgs = Math.max(
                    fnLength - numberOfArgs - 1, 0),
                argPadding = new Array(numberOfMissingArgs),
                    variadicArgs = __slice.call(
                        arguments, fn.length - 1);
            return fn.apply(
                this, namedArgs
                    .concat(argPadding)
                    .concat([variadicArgs]));

        }
    }
}

function unary(first) {
    return first;
}

console.log(unary('why', 'hello', 'there'));

console.log(variadic(unary)('why', 'hello', 'there'));

function binary(first, rest) {
    return [first, rest];
}

console.log(binary('why', 'hello', 'there'));

console.log(variadic(binary)('why', 'hello', 'there'));

var callLeft = variadic( function (fn, args) {
    return variadic( function (remainingArgs) {
        return fn.apply(this, args.concat(remainingArgs))
    });
});

var callRight = variadic( function (fn, args) {
    return variadic( function (precedingArgs) {
        return fn.apply(this, precedingArgs.concat(args))
    });
});

var mapper = variadic( function (fn, elements) {
    return elements.map(fn);
});

console.log(mapper(function (x) { return x * x }, 1, 2, 3));

var squarer = callLeft(mapper, function (x) { return x * x });

console.log(squarer(1,2,3));