//////////////////////////////////////////////////////////////////
//                          Chapter 11                          //
//                           Functions                          //
//////////////////////////////////////////////////////////////////
var print = console.log;
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

print(Nullo.prototype);
// => Nullo {}

// prototype is an ordinary object with exactly the same properties that we expect to find in an instance:
// "Classes" are objects in classical languages, but they are a special kind

// Instance behaviour in JavaScript is defined by modifying the prototype directly
// by adding functions to it as properties.

//////////////////////////////////////////////////////////////////
//               New-Agnostic Constructor Pattern               //
//////////////////////////////////////////////////////////////////
