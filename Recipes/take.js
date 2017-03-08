take = function (iter, numberToTake) {
    var count = 0;
    return function () {
        if (++count <= numberToTake) {
            return iter();
        } else {
            return void 0;
        }
    }
};