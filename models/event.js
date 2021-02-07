const mongoose = require('mongoose');

/*
const kittySchema = new mongoose.Schema({
  name: String
});
*/

// Schema is your plan
// It is a constructor function
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

// name the model & attach a schema to it
// models are the blueprint for creating objects that you actually use in the application
// this is also a constructor function


/*
Models are fancy constructors compiled from Schema definitions.
An instance of a model is called a document.
Models are responsible for creating and reading documents from the underlying MongoDB database.


When you call mongoose.model() on a schema, Mongoose compiles a model for you.

const schema = new mongoose.Schema({ name: 'string', size: 'string' });
const Tank = mongoose.model('Tank', schema);
The first argument is the singular name of the collection your model is for.
Mongoose automatically looks for the plural, lowercased version of your model name.
Thus, for the example above, the model Tank is for the tanks collection in the database.

Note: The .model() function makes a copy of schema.
Make sure that you've added everything you want to schema, including hooks, before calling .model()!

*/

// const Kitten = mongoose.model('Kitten', kittySchema);
module.exports = mongoose.model('Event', eventSchema);
