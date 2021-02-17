const express = require('express');
const bodyParser = require('body-parser'); // extract json from incoming requests
const { graphqlHTTP } = require('express-graphql'); // graphqlHttp is not a function w/o {} ... not a default vs. named import thing
const { buildSchema } = require('graphql'); // generates graphql schema from the passed in strings ... using backtickets / template string (also called template literal) ... for a multiline string
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

// schema & query & mutation are three keywords that buildSchema is looking for ... based on the graphql specification
    // query is fetching data
    // mutations is changing data (creating, updating, deleting)
/*
  schema {
    query: RootQuery
    mutation: RootMutation
  }
*/

// RootQuery & RootMutation are just names of types that you defined ... since graphql is a typed query language

// [String] means a list of strings
  // first ! means has be Strings
  // second ! means can't be null ... has to return a list of strings or an empty list
// queries can also have arguments -> you could have events(booked: Boolean): [String!]!


// 'rootValue' points to resolvers.
// args is a built-in object keyword, will be null in the resolver if no parameters are passed in its matching query or mutator

// events is a function so you may think it would be appropriate to call this getEvents but the naming convention
// in graphql is to name it like a prop that holds whatever the function returns

// note the resolvers names must match the query and / or mutation

// input is a special keyword to define the type of arguments


// mongodb will automatically create an id
// must return the promise so nodejs knows it is async. you're telling it not to return to early
// save method is given to us by mongoose ... it hits the database and performs a write operation

// method given to us by mongoose to make sure we are returning what we want
// the result without this is enriched

// the password for User is nullable because that is not something we should ever return

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find().then(events => {
          return events.map(event => {
            return { ...event._doc };
          });
        })
        .catch(err => {
          throw err;
        });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '602c9ea2207b0404e8a90770'
        })
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString() };
            return User.findById('602c9ea2207b0404e8a90770')
        })
        .then(user => {
          if (!user) {
            throw new Error('user not found');
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(result => {
          return createdEvent;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
      },
      createUser: args => {
        return User.findOne({ email: args.userInput.email }).then(user => {
          if (user) {
            throw new Error('user exists already');
          }
          return bcrypt.hash(args.userInput.password, 12);
        })
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return { ...result._doc, password: null, _id: result.id }
          })
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@browsetablecluster.9b21n.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('sucessful connection to database')
    app.listen(3000);
  }).catch(err => {
    console.log(err);
    throw err;
  });

  // app.listen(3000);

/* example of what you can do in the graphiql playground

mutation {
  createEvent(eventInput: {title:"hi", description:"hoe", price: 12.1, date:"2021-02-05T04:09:02.525Z"}) {
    title
  }
}

query {
  events {
    title
    price
  }
}

mutation {
  createUser(userInput: {email: 'test@test.com', password: 'tester'}) {
    email
    password
  }
}

*/

/*

Historical note:

Graphql used to not be able to handle the ObjectId value that was coming from MongoDB and you had to explictly
covert it to a string like this:

  return { ...event._doc, _id: event._doc._id.toString() };

*/
