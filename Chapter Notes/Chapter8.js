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

var Queue = function () {
    extend(this, {
        array: [],
        head: 0,
        tail: -1
    })
};

extend(Queue.prototype, {
    pushTail: function (value) {
        return this.array[this.tail += 1] = value
    },
    pullHead: function () {
        var value;

        if (!this.isEmpty()) {
            value = this.array[this.head];
            this.array[this.head] = void 0;
            this.head += 1;
            return value;
        }
    },
    isEmpty: function () {
        return this.tail < this.head
    }
});

var jukeBox = new Queue();

jukeBox.pushTail('hair');
jukeBox.pushTail('feet');
jukeBox.pushTail('head');
console.log(jukeBox.pullHead());
console.log(jukeBox.isEmpty());
console.log(jukeBox.pullHead());
console.log(jukeBox.isEmpty());

console.log(Queue.prototype);
console.log(jukeBox);
//////////////////////////////////////////////////////////////////
//          Partial Application, Binding and Currying           //
//////////////////////////////////////////////////////////////////

var callLeft = variadic( function (fn, args) {
    return variadic( function (remainingArgs) {
        return fn.apply(this, args.concat(remainingArgs))
    })
});

function add (verb, a, b) {
    return "The " + verb + " of " + a + ' and ' + b + ' is ' + (a + b)
}

var sumFive = callLeft(add, 'sum', 5);

console.log(sumFive(6));

var totalSix = add.bind(null, 'total', 6);

console.log(totalSix(9));

//////////////////////////////////////////////////////////////////
//                   A Class By Any Other Name                  //
//////////////////////////////////////////////////////////////////

function Todo (name) {
    this.name = name || 'Untitled';
    this.done = false;
}

Todo.prototype.do = function () {
    this.done = true;
};

Todo.prototype.undo = function () {
    this.done = false;
};

extend(Todo.prototype, {
    prioritize: function (priority) {
        this.priority = priority;
    }
});

var chore1 = new Todo('Groceries');

chore1.prioritize('URGENT');

chore1.do();

console.log(chore1);
console.log("colorCoded__________");

var colorCoded = {
    setColorRGB: function (r,g,b) {
        return "colorRGB set"
    },
    getColorRGB: function () {
        // ...
    },
    setColorCSS: function (css) {
        // ...
    },
    getColorCss: function () {
        // ...
    }
};

extend(Todo.prototype, colorCoded);
console.log(Todo.prototype);
console.log(chore1);
console.log(chore1.setColorRGB(1,2,3));

//////////////////////////////////////////////////////////////////
//                        Object Methods                        //
//////////////////////////////////////////////////////////////////

QueueMaker = function () {
    return {
        array: [],
        head: 0,
        tail: -1,
        pushTail: function (value) {
            return this.array[this.tail += 1] = value
        },
        pullHead: function () {
            var value;

            if (this.tail >= this.head) {
                value = this.array[this.head];
                this.array[this.head] = void 0;
                this.head += 1;
                return value
            }
        },
        isEmpty: function () {
            return this.tail < this.head
        }
    }
};

var jake = new QueueMaker();
console.log(jake);

var WidgetModel = function (id, attrs) {
    extend(this, attrs || {});
    this.id = function () { return id };
    // this gives every instance it's own id
};

extend(WidgetModel.prototype, {
    set: function (attr, value) {
        this[attr] = value;
        return this;
    },
    get: function (attr) {
        return this[attr]
    }
});

// id is an object method while set and get are instance methods
// object methods are created for every instance
// instance method is a function described in the constructor's prototype
// every instance acquires this behavior unless overridden
// instance methods are shared by all instances
// instance methods use less memory

//////////////////////////////////////////////////////////////////
//              Extending Classes with Inheritance              //
//////////////////////////////////////////////////////////////////

var Queue = function () {
    extend(this, {
        array: [],
        head: 0,
        tail: -1
    });
};

extend(Queue.prototype, {
    pushTail: function (value) {
        return this.array[this.tail += 1] = value;
    },
    pullHead: function () {
        var value;

        if (!this.isEmpty()) {
            value = this.array[this.head];
            this.array[this.head] = void 0;
            this.head += 1;
            return value;
        }
    },
    isEmpty: function () { return this.tail < this.head }
});

var QueueProxy = function () {
    this.constructor = Dequeue;
};

QueueProxy.prototype = Queue.prototype;

var Dequeue = function () {
    Queue.prototype.constructor.call(this)
};

Dequeue.INCREMENT = 4;

Dequeue.prototype = new QueueProxy();

extend(Dequeue.prototype, {
    size: function () {
        return this.tail - this.head + 1
    },
    pullTail: function () {
        var value;

        if (!this.isEmpty()) {
            value = this.array[this.tail];
            this.array[this.tail] = void 0;
            this.tail -= 1
            return value;
        }
    },
    pushHead: function () {
        var i;

        if (this.head === 0) {
            for (i = this.tail; i >= this.head; --i) {
                this.array[i + this.constructor.INCREMENT] = this.array[i]
            }
            this.tail += this.constructor.INCREMENT;
            this.head += this.constructor.INCREMENT;
        }
        this.array[this.head -= 1] = value;
    }
});

d = new Dequeue();
d.pushTail('Hello');
d.pushTail('JavaScript');
d.pushTail('!')
console.log(d.pullHead());
console.log(d.pullTail());
console.log(d.pullHead());

console.log(d.prototype);
console.log(Dequeue.prototype);
console.log(Queue.prototype);
console.log(d.constructor);

var child = function (parent, child) {
    var proxy = function () {
        this.constructor = child;
    }
    proxy.prototype = parent.prototype;
    child.prototype = new proxy();
    return child;
};

var Dequeue2 = child(Queue, function () {
    Queue.prototype.constructor.call(this)
});

Dequeue2.INCREMENT = 4;

extend(Dequeue2.prototype, {
    size: function () {
        return this.tail - this.head + 1;
    },
    pullTail: function () {
        var value;

        if (!this.isEmpty()) {
            value = this.array[this.tail];
            this.array[this.tail] = void 0;
            this.tail -= 1;
            return value;
        }
    },
    pushHead: function (value) {
        var i;

        if (this.head === 0) {
            for (i = this.tail; i >= this.head; --i) {
                this.array[i + this.constructor.INCREMENT] = this.array[i];
            }
            this.tail += this.constructor.INCREMENT;
            this.head += this.constructor.INCREMENT;
        }
        this.array[this.head -= 1] = value;
    }
});

// The new keyword turns any function into a constructor for creating instances
// All functions have a prototype element.
// Instances behave as if the elements of their constructor's prototype are their elements
// Instances can override their constructor's prototype without altering it
// The relationship between instances and their constructor's prototype is dynamic
// this works seamlessly with methods defined in prototypes
// Everything behaves like an object
// JavaScript can convert primitives into instances and back into primitives
// Object methods are typically created in the constructor and are private to each object
// Prototypes can be chained to allow extension of instances
// JavaScript has classes and methods, they just aren't formally called classes and methods in the language's syntax.