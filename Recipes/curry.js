// Here is the recipe for a higher-order function that curries its argument function.
// It works with any function that has a fixed length
// It lets you provide as many arguments as you like.

var __slice = Array.prototype.slice;

function curry (fn) {
    var arity = fn.length;

    return given([]);

    function given (argsSoFar) {
        return function helper () {
            var updatedArgsSoFar = argsSoFar.concat(__slice.call(arguments, 0));

            if (updatedArgsSoFar.length >= arity) {
                return fn.apply(this, updatedArgsSoFar)
            }
            else return given(updatedArgsSoFar)
        }
    }
}

function sumOfFour(a, b, c, d) {
    return a + b + c + d
}

var curried = curry(sumOfFour);

console.log(curried(1)(2)(3)(4));
// => 10

console.log(curried(1,2)(3)(4));
// => 10

console.log(curried(1,2,3)(4));
// => 10

console.log(curried(1,2)(3,4));
// => 10

console.log(curried(1,2,3,4));
// => 10

function callLeft (fn) {
    return curry(fn).apply(null, __slice.call(arguments, 1))
}

console.log(callLeft(sumOfFour, 1)(2, 3, 4));
// => 10

console.log(callLeft(sumOfFour, 1, 2)(3,4));
// => 10
