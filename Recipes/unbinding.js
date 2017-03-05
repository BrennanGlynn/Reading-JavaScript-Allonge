// This is a method to remove a binding from a function

var unbind = function unbind (fn) {
    return fn.unbound ? unbind(fn.unbound()) : fn
};

function bind (fn, context, force) {
    var unbound, bound;

    if (force) {
        fn = unbind(fn);
    }
    bound = function () {
        return fn.apply(context, arguments)
    };
    bound.unbound = function () {
        return fn;
    };

    return bound;
}

function myName () {
    return this.name
}

var harpo = { name: 'Harpo' },
    chico = { name: 'Chico' },
    groucho = { name: 'Groucho' };

var fh = bind(myName, harpo);
console.log(fh());
// => Harpo

var fc = bind(myName, chico);
console.log(fc());
// => Chico

var fhg = bind(fh, groucho);
console.log(fhg());
// => Harpo

var fhug = bind(fh, groucho, true);
console.log(fhug());
// => Groucho

var fhug2 = bind(unbind(fh), groucho);
console.log(fhug2());
// => Groucho

console.log(fc.unbound().call(groucho));
// => Groucho

console.log(unbind(fh).apply(groucho, []));
// => Groucho