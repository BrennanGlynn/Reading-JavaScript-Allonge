var __slice = Array.prototype.slice;

function callFirst(fn, larg) {
    return function () {
        var args = __slice.call(arguments, 0);

        return fn.apply(this, [larg].concat(args))
    }
}

function callLast(fn, rarg) {
    return function () {
        var args = __slice.call(arguments, 0);

        return fn.apply(this, args.concat([rarg]));
    }
}

function greet(me, you) {
    return "Hello, " + you + ", my name is " + me;
}

var brennanSaysHello = callFirst(greet, "Brennan");
var sayHelloToBrennan = callLast(greet, "Brennan");
console.log(brennanSaysHello("Ganondorf"));
console.log(sayHelloToBrennan("Zelda"));
