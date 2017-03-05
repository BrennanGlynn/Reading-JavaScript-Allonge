// maybe reduces the logic of checking for nothing to a function call

// A function fn takes a value as a parameter, and its behaviour
// by design is to do nothing if the parameter is nothing

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