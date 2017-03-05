function once(fn) {
    var done = false,
        testAndSet;

    if (!!fn.name) {
        testAndSet = function () {
            this["__once__"] || (this["__once__"] = {})
            if (this["__once__"][fn.name]) return true;
            this["__once__"][fn.name] = true;
            return false
        }
    } else {
        testAndSet = function (fn) {
            if (done) return true
            done = true;
            return false;
        }
    }

    return function () {
        return testAndSet.call(this) ? void 0 : fn.apply(this, arguments)
    }
}

console.log(once(function askedOnDate () {
    return "sure, why not?"
})());
// => "sure, why not?"

console.log(once(function askedOnDate() {
    return "sur, why not?"
})());
// => undefined

//
// NOTE! function must be named to work
//

function Widget () {};

Widget.prototype.setVolume = function setVolume (volume) {
    this.volume = volume;
    return this
};

Widget.prototype.setDensity = function setDensity (density) {
    this.density = density;
    return this
};

Widget.prototype.setLength = function setLength (length) {
    this.length = length;
    return this
};

Widget.prototype.initialize = once(function initialize() {
    // do some initialization
    return this
});

var w = new Widget()
    .setVolume(10)
    .setDensity(8)
    .setLength(100)
    .initialize();

console.log(w);