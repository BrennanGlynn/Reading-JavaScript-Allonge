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

function fluent (methodBody) {
    return function () {
        methodBody.apply(this, arguments);
        return this;
    }
}

///////////////////////////////////////////////////////////////

function before (decoration) {
    return function (method) {
        return function () {
            decoration.apply(this, arguments);
            return method.apply(this, arguments)
        }
    }
}

// We use "before" to ensure one function is completed before another

function Cake() {
    this.ingredients = {}
}

extend(Cake.prototype, {
    setFlavor: fluent( function (flavor) {
        this.flavor = flavor;
    }),
    setLayers: fluent( function (layers) {
        this.layers = layers;
    }),
    add: fluent( function (ingredientMap) {
        var ingredient;

        for (ingredient in ingredientMap) {
            this.ingredients[ingredient] || (this.ingredients[ingredient] = 0);
            this.ingredients[ingredient] = this.ingredients[ingredient] + ingredientMap[ingredient];
        }
    }),
    mix: fluent( function () {
        // mix ingredients together
    }),
    rise: fluent( function (duration) {
        // let ingredients rise
    }),
    bake: fluent( function () {
        // do some baking
    })
});

// But we want the ingredients to be mixed before rise or bake can
// be completed. Introduce before

var mixFirst = before(function () {
    this.mix()
});

extend(Cake.prototype, {
    // other methods...

    mix: fluent( function () {
        // mix ingredients together
    }),
    rise: fluent( mixFirst( function (duration) {
        // let the ingredients rise
    })),
    bake: fluent( mixFirst( function () {
        // do some baking
    }))
});

// "before", "after" and many more combinators for building method
// decorators can be found in the method combinators module
// https://github.com/raganwald/method-combinators/blob/master/README-JS.md#method-combinators