const express = require('express');
const bodyParser = require('body-parser'); // extract json from incoming requests
const { graphqlHTTP } = require('express-graphql'); // graphqlHttp is not a function w/o {} ... not a default vs. named import thing
const { buildSchema } = require('graphql'); // generates graphql schema from the passed in strings ... using backtickets / template string (also called template literal) ... for a multiline string

const app = express();

const events = []; // temporary global variable / 'in-memory'

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
app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return events
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: args.eventInput.date
        };
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(3000);


/* example of what you can do in the graphiql playground

mutation {
  createEvent(eventInput: {title:"hi", description:"hoe", price: 12.1, date:"N/A!"}) {
    title
  }
}

query {
  events {
    title
    price
  }
}

*/
