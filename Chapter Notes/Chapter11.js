//////////////////////////////////////////////////////////////////
//                          Chapter 11                          //
//                           Functions                          //
//////////////////////////////////////////////////////////////////

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