// Ensures a function is only called once

function once(fn) {
    var done = false;

    return function () {
        return done ? void 0 : ((done = true), fn.apply(this, arguments))
    }
}

var askedOnBlindDate = once(function () {
    return "sure, why not?"
});

console.log(askedOnBlindDate());
// => "sure, why not?"

console.log(askedOnBlindDate());
// => undefined

console.log(askedOnBlindDate());
// => undefined

//
// Be careful. If you keep calling once, you'll keep getting a new function that executes once.
//

console.log(once(function () {
    return 'this function only fired once'
})());
// => 'this function only fired once'

console.log(once(function () {
    return 'oops it did it again!'
})());
// => 'oops it did it again!'