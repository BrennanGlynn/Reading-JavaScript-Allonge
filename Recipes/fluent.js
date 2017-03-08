// Object and instance methods can be bifurcated into two classes
// Those that query something, and those that update something.
// Most design philosophies arrange things such that update methods
//      return the value being updated.

var __slice = Array.prototype.slice;

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

///////////////////////////////////////////////////////////////////////////////////////

function Cake () {}

extend(Cake.prototype, {
    setFlavor: function (flavor) {
        this.flavor = flavor;
        return this
    },
    setLayers: function (layers) {
        this.layers = layers;
        return this
    },
    bake: function () {
        // bake something
        return this

    }
});

var cake = new Cake().
    setFlavor("Orange").
    setLayers(8).
    bake();

// For one-liners like setting a property, this is fine. But some functions are longer, and we
// want to signal the intent of the method at the top, not buried at the bottom. Normally this is
// done in the method’s name, but fluent interfaces are rarely written to include methods like
// setLayersAndReturnThis.

function fluent (methodBody) {
    return function () {
        methodBody.apply(this, arguments);
        return this;
    }
}

Cake.prototype.bake = fluent( function () {
    // do some baking
    // using many lines of code
    // and possibly multiple returns
});

console.log(Cake.prototype);

console.log(cake.bake());