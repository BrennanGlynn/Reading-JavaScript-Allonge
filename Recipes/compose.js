function compose (a, b) {
    return function (c) {
        return a(b(c));
    }
}

function cookAndEat1 (food) {
    return eat(cook(food))
}

function pluckWith (attr) {
    return mapWith(getWith(attr))
}

var cookAndEat = compose(eat, cook);
cookAndEat(food);