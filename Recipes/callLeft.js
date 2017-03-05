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
};

var callLeft = variadic( function (fn, args) {
    return variadic( function (remainingArgs) {
        return fn.apply(this, args.concat(remainingArgs))
    })
});

var callRight = variadic( function (fn, args) {
    return variadic( function (precedingArgs) {
        return fn.apply(this, precedingArgs.concat((args)))
    })
});