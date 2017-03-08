//////////////////////////////////////////////////////////////////
//                          Chapter 11                          //
//                           Functions                          //
//////////////////////////////////////////////////////////////////
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

var extend = variadic( function (consumer, providers) {
    var key,
        i,
        provider;

    for (i = 0; i < providers.length; i++) {
        provider = providers[i];
        for (key in provider) {
            if (provider.hasOwnProperty(key)) {
                consumer[key] = provider[key]
            }
        }
    }
    return consumer;
});

function fluent (methodBody) {
    return function () {
        methodBody.apply(this, arguments);
        return this;
    }
}

function even (num) { return (num === 0) || odd( num - 1) }
function odd (num) { return (num > 0) && even(num - 1) }
//////////////////////////////////////////////////////////////////
//                          Chapter 11                          //
//                           New Ideas                          //
//////////////////////////////////////////////////////////////////
/*                                                              */
//////////////////////////////////////////////////////////////////
//      How Prototypes and Constructors differ from Classes     //
//////////////////////////////////////////////////////////////////
//      JavaScript has constructors and prototypes
// JavaScript instances are created with a constructor
// The constructor of an instance is a function invoked with "new"
// In JavaScript, any function can be a constructor, even if it doesn't look like one

function square (n) { return n * n; }

square(2);
// => 4

square(2).constructor;
// => [Function: Number]

new square(2);
// => square {}

new square(2).constructor;
// [Function: square]

// Classical languages: class is a special kind of object that creates new instances
// JavaScript: no syntax or special object. Uses prototypes
// JavaScript: unlike classical no special methods or properties with prototypes
// JavaScript: any object including empty

function Nullo() {};

Nullo.prototype;
// => Nullo {}

// prototype is an ordinary object with exactly the same properties that we expect to find in an instance:
// "Classes" are objects in classical languages, but they are a special kind

// Instance behaviour in JavaScript is defined by modifying the prototype directly
// by adding functions to it as properties.

//////////////////////////////////////////////////////////////////
//                   New-Agnostic Constructor                   //
//////////////////////////////////////////////////////////////////

// JavaScript is inflexible about invoking "new" on a constructor

function User (name, password) {
    if(!(this instanceof User)) {
        return new User(name, password);
    }
    this.name = name || 'Untitled';
    this.password = password;
};

// Now you can call the constructor without the "new" keyword

var a = User('Brennan', '3liteh4ks');
console.log(a.constructor);

// This in turn opens up the possibility of doing dynamic things with constructors
// that didn't work when you were forced to use "new"

function withDefaultPassword () {
    var args = Array.prototype.slice.call(arguments, 0);
    args[1] = 'swordfish';
    return User.apply(this, args);
}

console.log(withDefaultPassword('Hannah'));

// The pattern above has a tradeoff: It works for all circumstances except when you want to set up an inheritance hierarchy.

//////////////////////////////////////////////////////////////////
//            Another New-Agnostic Constructor Patter           //
//////////////////////////////////////////////////////////////////

function User2 (name, password) {
    var self = this instanceof User ? this : new User();
    if (name != null) {
        self.name = name;
        self.password = password;
    }
    return self;
}

console.log(User2('Mike', 'Hunt'));
console.log(new User2('Brennan', 'Glynn'));

//////////////////////////////////////////////////////////////////
//                            Mixins                            //
//////////////////////////////////////////////////////////////////

function Todo (name) {
    var self = this instanceof Todo ? this : new Todo();
    self.name = name || 'Untitled';
    self.done = false;
    return self;
}

Todo.prototype.do = fluent( function () {
    this.done = true;
});

Todo.prototype.undo = fluent( function () {
    this.done = false;
});

// var ColorCoded = {
//     setColorRGB: fluent( function (r, g, b) {
//         this.colorCode = {r: r, g: g, b: b };
//     }),
//     getColorRGB: function () {
//         return this.colorCode;
//     }
// };
//
// extend(Todo.prototype, ColorCoded);
// console.log(Todo.prototype);

// A simple definition that works for most purposes is to define a mixin as: A collection of
// behaviour that can be added to a class’s existing prototype

// The mixin we have above works properly, but our little recipe had two distinct steps
// 1. Define the mixin
// 2. Extend the class prototype

// It's more elegant to define a mixin as a function than an object
// This is called a functional mixin

function becomeColorCoded (target) {
    target.setColorRGB = fluent( function (r, g, b) {
        this.colorCode = { r: r, g: g, b: b };
    });
    target.getColorRGB = function () {
        return this.colorCode;
    };
    return target;
}

// becomeColorCoded(Todo.prototype);
// console.log(Todo.prototype);

// You could mix functionality directly into an object if you so choose.

function asColorCoded() {
    this.setColorRGB = fluent( function (r, g, b) {
        this.colorCode = {r: r, g: g, b: b};
    });

    this.getColorRGB = function () {
        return this.colorCode;
    };

    return this;
}

// asColorCoded.call(Todo.prototype);
// console.log(Todo.prototype);

// It’s possible to write a context-agnostic functional mixin

function originated() {
    if (arguments[0] !== void 0) {
        return originated.call(arguments[0])
    }
    this.setCountry = fluent( function (country) {
        this.country = country;
    });
    this.getCountry = function () {
        return this.country
    };
    return this
}

function wake() {
    if (arguments[0] !== void 0) {
        return wake.call(arguments[0])
    }
    this.awake = fluent( function () {
        this.woke = true;
    });
    this.fool = fluent( function () {
        this.woke = false;
    })
}

var person = function (name) {
    var self = this instanceof person ? this : new person();
    self.name = name || 'Anon';
    self.woke = false;
    return self;
};

originated(person.prototype);
wake(person.prototype);
console.log(person.prototype);
var jerry = person('Jerry');
jerry.setCountry('Germany');
jerry.awake();
console.log(jerry.getCountry());
console.log(jerry.woke);
jerry.fool();
console.log(jerry.woke);

//////////////////////////////////////////////////////////////////
//                       Class Decorators                       //
//////////////////////////////////////////////////////////////////

// The function decorator pattern being discussed here only works with constructors that are new-agnostic
// Here is ColorCoded as a class decorator
// It returns a new class rather than modifying Todo

function AndColorCoded (clazz) {
    function Decorated () {
        var self = this instanceof Decorated ? this : new Decorated();
        return clazz.apply(self, arguments);
    }
    Decorated.prototype = new clazz();

    Decorated.prototype.setColorRGB = fluent( function (r, g, b) {
        this.colorCode = { r: r, g: g, b: b };
    });

    Decorated.prototype.getColorRGB = function () {
        return this.colorCode
    };

    return Decorated;
}

var ColorTodo = AndColorCoded(Todo);

console.log(Todo.prototype);

var colorTodo = new ColorTodo('Write more JavaScript');
colorTodo.setColorRGB(255, 200, 200);
console.log(Todo.prototype);
// => { do: [Function], undo: [Function] }

console.log(colorTodo);
// => { name: 'Write more JavaScript', done: false, colorCode: { r: 255, g: 200, b: 200 }

console.log(colorTodo instanceof Todo);
// => true

console.log(colorTodo instanceof ColorTodo);
// => true

// Class decorators can be an improvement when you don't want to modify an existing prototype

//////////////////////////////////////////////////////////////////
//                     Functional Iterators                     //
//////////////////////////////////////////////////////////////////

function sum (array) {
    var number,
        total = 0,
        len = array.length;

    for (i = 0; i < len; i++) {
        number = array[i];
        total += number;
    }

    return total;
}

// What if we want the sum of a linked list? Tree of numbers?

// One option is to write an iterator for each data structure and write sum to take an iterator as an arg

var LinkedList, list;

LinkedList = (function () {
    function LinkedList(content, next) {
        this.content = content;
        this.next = next != null ? next : void 0;
    }

    LinkedList.prototype.appendTo = function (content) {
        return new LinkedList(content, this);
    };

    LinkedList.prototype.tailNode = function () {
        var nextThis;
        return ((nextThis = this.next) != null ? nextThis.tailNode() : void 0) || this;
    };

    return LinkedList;
})();

function ListIterator (list) {
    return function () {
        var node;
        node = list != null ? list.content : void 0;
        list = list != null ? list.next : void 0;
        return node;
    }
}

function newSum(iter) {
    var number, total;
    total = 0;
    number = iter();
    while (number != null) {
        total += number;
        number = iter();
    }
    return total;
}

list = new LinkedList(5).appendTo(4).appendTo(3).appendTo(2).appendTo(1);

console.log(newSum(ListIterator(list)));
// => 15

function ArrayIterator (array) {
    var index;
    index = 0;
    return function () {
        return array[index++];
    }
}

console.log(newSum(ArrayIterator([1,2,3,4,5])));
// => 15

function fold (iter, binaryFn, seed) {
    var acc = seed,
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

console.log(foldingSum(ArrayIterator([1,2,3,4,5])));
// => 15

function NumberIterator (base) {
    var number;

    if (base == null) {
        base = 0;
    }
    number = base;
    return function () {
        return number++
    }
}

fromOne = NumberIterator(1);

fromOne();
// => 1

fromOne();
// => 2

fromOne();
// => 3

fromOne();
// => 4

fromOne();
// => 5

function FibonacciIterator () {
    var previous = 0,
        current = 1;
    return function () {
        var value, tempValues;
        value = current;
        tempValues = [current, current + previous];
        previous = tempValues[0];
        current = tempValues[1];
        return value;
    }
}

fib = FibonacciIterator();

fib();
// => 1
fib();
// => 1
fib();
// => 3
fib();
// => 5

// A function that starts with a seed and expands it into a data structure is called an unfold.

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

oneToFive = take(NumberIterator(1), 5);

oneToFive();
// => 1

oneToFive();
// => 2

oneToFive();
// => 3

oneToFive();
// => 4

oneToFive();
// => 5

oneToFive();
// => undefined

function iteratorMap (iter, unaryFn) {
    return function () {
        var element;
        element = iter();
        if (element != null) {
            return unaryFn.call(element, element);
        } else {
            return void 0;
        }
    }
}

function squaresIterator (iter) {
    return iteratorMap(iter, function (n) {
        return n * n;
    })
}

function iteratorFilter (iter, unaryPredicateFn) {
    return function () {
        var element = iter();
        while (element != null) {
            if (unaryPredicateFn.call(element, element)) {
                return element;
            }
            element = iter();
        }

        return void 0;
    }
}

function oddsFilter (iter) {
    return iteratorFilter(iter, odd);
}

foldingSum(take(oddsFilter(squaresIterator(FibonacciIterator())), 5));
// => 205

/*
summary
Untangling the concerns of how to iterate over data from what to do with data leads us to thinking
of iterators and working directly with iterators. For example, we can map and filter iterators rather
than trying to write separate map and filter functions or methods for each type of data structure.
This leads to the possibility of working with lazy or infinite iterators

caveat
Once you pass an iterator to a function, you can expect that you no longer "own" that iterator,
and that its state either has changed or will change.
*/

//////////////////////////////////////////////////////////////////
//              Refactoring to Functional Iterators             //
//////////////////////////////////////////////////////////////////

function tortoiseAndHareLoopDetector (list) {
    var hare = list.next,
        tortoise = list,
        nexthare;

    while ((tortoise != null) && (hare != null)) {
        if (tortoise === hare) {
            return true
        }
        tortoise = tortoise.next;
        hare = (nexthare = hare.next) != null ? nexthare.next : void 0;
    }
    return false;
}

// A functional iterator is a stateful function that iterates of a data structure
// Every time you call it, it returns the next element from the data structure
// If and when it completes its traversal, it returns undefined

// Here is a function that takes an array and returns a functional iterator over the array

function ArrayIterator (array) {
    var index = 0;
    return function () {
        return array[index++]
    }
}

// Iterators allow us to write functions to operate on iterators instead of data structures.
// Now we'll refactor the tortoise and hare to use iterators

LinkedList.prototype.iterator = function () {
    var list = this;
    return function () {
        var value = list != null ? list.content : void 0;
        list = list != null ? list.next : void 0;
        return value;
    }
};

function tortoiseDetectorTwo (iterable) {
    var tortoise = iterable.iterator(),
        hare = iterable.iterator(),
        tortoiseValue,
        hareValue;
    while (((tortoiseValue = tortoise()) != null) && ((hare(), hareValue = hare()) != null)) {
        if (tortoiseValue === hareValue) {
            return true
        }
    }
    return false
}

console.log(tortoiseDetectorTwo(list));
// => false

list.tailNode().next = list.next;

console.log(tortoiseDetectorTwo(list));
// => true

//////////////////////////////////////////////////////////////////
//             A Drunken Walk Across A Checkerboard             //
//////////////////////////////////////////////////////////////////