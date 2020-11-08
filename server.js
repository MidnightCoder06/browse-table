const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); // graphqlHttp is not a function w/o {} ... not a default vs. named import thing
const { buildSchema } = require('graphql'); // generates graphql schema from the passed in strings ... using backtickets / template string (also called template literal) ... for a multiline string

const app = express();

app.use(bodyParser.json());

// query & mutation are two keywords that buildSchema is looking for ... based on the graphql specification
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


// 'rootValue' is the resolver.
// // args is a built-in object keyword, will be null in the resolver if no parameters are passed in its matching query or mutator

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
      type RootQuery {
        events: [String!]!
      }

      type RootMutation {
        createEvent(name: String): String
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return ['fake return data #1', 'fake return data #2']
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
