//////////////////////////////////////////////////////////////////
//                          Chapter 10                          //
//                      Required Functions                      //
//////////////////////////////////////////////////////////////////
var __slice = Array.prototype.slice;



function maybe(fn) {
    return function () {
        var i;

        if (arguments.length === 0) {
            return
        } else {
            for (i = 0; i < arguments.length; i++) {
                if (arguments[i] == null) {
                    return
                }
                return fn.apply(this, arguments)
            }
        }
    }
}

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

var extend = variadic( function (consumer, providers) {
    var key,
        i,
        provider;

    for (i = 0; i < providers.length; i++) {
        provider = providers[i];
        for (key in provider) {
            if (provider.hasOwnProperty(key)) {
                consumer[key] = provider[key]
            }
        }
    }
    return consumer;
});

function fluent (methodBody) {
    return function () {
        methodBody.apply(this, arguments);
        return this;
    }
}
//////////////////////////////////////////////////////////////////
//                          Chapter 10                          //
//                           Sequence                           //
//////////////////////////////////////////////////////////////////
/*                                                              */
//////////////////////////////////////////////////////////////////
//              Introduction: Compose and Pipeline              //
//////////////////////////////////////////////////////////////////

// We're going to look back at a larger pattern, the use of "sequence" to control
// the processing of information.

/*
// In Chapter 1 Combinators and Function Decorators we saw "compose"

function compose (a, b) {
    return function (c) {
        return(a(b(c)))
    }
}

function addOne (number) {
    return number + 1
}

function double (number) {
    return number * 2
}

// Instead of

function doubleOfAddOne (number) {
    return double(addOne(number))
}

// We would write

var doubleOfAddOne = compose(double, addOne);

//////////////////////////////////////////////////////////////////
//                   The semantics of compose                   //
//////////////////////////////////////////////////////////////////

// With compose we're usually making a new function
// We don't need to write things like compose(double, addOne)(3)
// It's easier and clearer to write double(addOne(3))

// On the other hand, when working with something like method decorators, it can help to write
var setter = compose(fluent, maybe);

SomeClass.prototype.setUser = setter(function (user) {
    this.user = user;
});

SomeClass.prototype.setPrivileges = setter(function (privileges) {
   this.privileges = privileges;
});

// This makes it clear that setter adds the behaviour of both fluent and maybe to each
// method it decorates, and it's simpler to read

var setter = compose(fluent, maybe)

// Than

function setter(fn) {
    return fluent(maybe(fn))
}

// The take-away is that compose is helpful when we are defining a new function
// that combines the effects of existing functions
*/

//////////////////////////////////////////////////////////////////
//                           Pipeline                           //
//////////////////////////////////////////////////////////////////

// compose is handy, but doesn't communicate order on operations
// compose is written to match that a happens after b
// compose(a, b) = a(b())

// Sometimes it makes more sense to compose functions in data flow order
// The value flows through a and then through b

var pipeline = flip(compose);
/*
 Comparing pipeline to compose, pipeline says “add one to the number and then double it.”
 Compose says, “double the result of adding one to the number.” Both do the same job, but
 communicate their intention in opposite ways.
 */