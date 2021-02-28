const { buildSchema } = require('graphql'); // generates graphql schema from the passed in strings ... using backtickets / template string (also called template literal) ... for a multiline string


/*

An id is automatically added by mongoose
for bookings both createdAt and updatedAt are created automatically by mongoose

schema & query & mutation are three keywords that buildSchema is looking for ... based on the graphql specification
*query is fetching data
*mutations is changing data (creating, updating, deleting)

schema {
  query: RootQuery
  mutation: RootMutation
}

RootQuery & RootMutation are just names of types that you defined ... since graphql is a typed query language

[String] means a list of strings
*first ! means has be Strings
*second ! means can't be null ... has to return a list of strings or an empty list

queries can also have arguments -> you could have events(booked: Boolean): [String!]!

input is a special keyword to define the type of arguments

_doc is a method given to us by mongoose to make sure we are returning what we want
*the result without this is enriched

the password for User is nullable because that is not something we should ever return

*/

module.exports = buildSchema(`
    type Booking {
      _id: ID!
      event: Event!
      user: User!
      createdAt: String!
      updatedAt: String!
    }

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
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
      bookEvent(eventId: ID!): Booking!
      cancelBooking(bookingId: ID!): Event!
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)
