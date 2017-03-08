function fold (iter, binaryFn, seed) {
    var acc, element;
    acc = seed;
    element = iter();
    while (element != null) {
        acc = binaryFn.call(element, acc, element);
        element = iter();
    }
    return acc;
}

function foldingSum (iter) {
    return fold(iter, (function (x, y) {
        return x + y;
    }), 0);
}
