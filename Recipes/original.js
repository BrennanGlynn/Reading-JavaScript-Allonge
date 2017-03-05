// Can use original to turn an object back to a primitive value

var orginal = function (unknown) {
    return unknown.constructor(unknown);
};

console.log(true === true);
// => true

console.log(new Boolean(true) === true);
// => false

console.log(new Boolean(false) === false);
// => false

console.log(new Boolean(false) === false);
// => false

console.log(orginal(true) === true);
// => true

console.log(orginal(new Boolean(true)) === true);
// => true