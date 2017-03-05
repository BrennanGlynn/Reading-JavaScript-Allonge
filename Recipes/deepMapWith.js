// We can use deepMapWith on a tree the way we use mapWith on a flat array

function deepMapWith(fn) {
    return function innerdeepMapWith(tree) {
        return Array.prototype.map.call(tree, function (element) {
            if (Array.isArray(element)) {
                return innerdeepMapWith(element);
            }
            else return fn(element);
        });
    };
};