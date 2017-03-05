var a = [1,2,3], accrete;

var contextualize = function (fn, context) {
    return function () {
        return fn.apply(context, arguments);
    }
};

var aFourthObject = {},
    returnThis = function () { return this;};

aFourthObject.uncontextualized = returnThis;
aFourthObject.contextualized = contextualize(returnThis, aFourthObject);

console.log(aFourthObject.uncontextualized() === aFourthObject);
console.log(aFourthObject.contextualized() === aFourthObject);

var uncontextualized = aFourthObject.uncontextualized,
    contextualized = aFourthObject.contextualized;

console.log(uncontextualized());
console.log(contextualized() === aFourthObject);