// Send is useful when invoking a function that’s a member of an object (or of an instance’s prototype).
// But we sometimes want to invoke a function that is designed to be executed within
// an object’s context. This happens most often when we want to “borrow” a method
// from one “class” and use it on another object.

var __slice = Array.prototype.slice;

function invoke (fn) {
    var args = __slice.call(arguments, 1);

    return function (instance) {
        return fn.apply(instance, args)
    }
}

function mapWith(fn) {
    return function (list) {
        return Array.prototype.map.call(list, function (something) {
            return fn.call(this, something);
        });
    };
};

function callFirst(fn, larg) {
    return function () {
        var args = __slice.call(arguments, 0);

        return fn.apply(this, [larg].concat(args))
    }
}

var data = [
    {
        0: 'zero',
        1: 'one',
        2: 'two',
        foo: 'foo',
        length: 3
    }
];

var copy = callFirst(__slice, 0);

console.log(mapWith(invoke(copy))(data));

// invoke is useful when you have the function and are looking for the instance.
// It can be written “the other way around,” for when you have the instance and are looking for the function

function instanceEval (instance) {
    return function (fn) {
        var args = __slice.call(arguments, 1)

        return fn.apply(instance, args)
    }
}

var args = instanceEval(arguments)(__slice, 0);