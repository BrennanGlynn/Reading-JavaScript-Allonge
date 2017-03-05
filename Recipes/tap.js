function tap (value, fn) {
    if (fn === void 0) {
        return curried;
    }

    else return curried(fn);

    function curried (fn) {
        if (typeof(fn) === 'function') {
            fn(value);
        }
        return value;
    }
}

var drink = tap('espresso')(function (it) {
    console.log("Our drink is", it);
});

var otherDrink = tap('coke', function (it) {
    console.log("Our drink is", it)
});

var doNothing = tap('milk')();

var alsoNothing = tap('orange juice', null);