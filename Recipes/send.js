// Previously, we saw that the recipe bound can be used to get a bound method from an
// instance. Unfortunately, invoking such methods is a little messy

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

function mapWith(fn) {
    return function (list) {
        return Array.prototype.map.call(list, function (something) {
            return fn.call(this, something);
        });
    };
};

function InventoryRecord (apples, oranges, eggs) {
    this.record = {
        apples: apples,
        oranges: oranges,
        eggs: eggs
    }
}

InventoryRecord.prototype.apples = function apples() {
    return this.record.apples
};

InventoryRecord.prototype.oranges = function oranges() {
    return this.record.oranges
};

InventoryRecord.prototype.eggs = function eggs() {
    return this.record.eggs
};

var inventories = [
    new InventoryRecord(0, 144, 36),
    new InventoryRecord(240, 54, 12),
    new InventoryRecord(25, 13, 43)
];

var send = variadic( function (methodName, leftArguments) {
    return variadic( function (receiver, rightArguments) {
        return receiver[methodName].apply(receiver, leftArguments.concat(rightArguments))
    })
});

console.log(mapWith(send('apples'))(inventories));

console.log(inventories);