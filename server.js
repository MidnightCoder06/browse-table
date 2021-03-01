const express = require('express');
const bodyParser = require('body-parser'); // extract json from incoming requests
const { graphqlHTTP } = require('express-graphql'); // graphqlHttp is not a function w/o {} ... not a default vs. named import thing
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();
app.use(bodyParser.json());
// this passes isAuth to the entire app so any file can use it 
app.use(isAuth);


app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
    rootValue: graphqlResolvers,
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

/* example of what you can do in the graphiql playground

mutation {
  createEvent(eventInput: {title:"hi...", description:"hoe....", price: 12.19, date:"2021-02-05T04:09:02.525Z"}) {
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
    _id
    email
    password
  }
}

mutation {
  createEvent(eventInput: {title:"love the complexity", description:"fun times", price: 12.98, date:"2021-02-05T04:09:02.525Z"}) {
    title
    creator {
      email
    }
  }
}

*/

/*

Historical note:

Graphql used to not be able to handle the ObjectId value that was coming from MongoDB and you had to explictly
covert it to a string like this:

  return { ...event._doc, _id: event._doc._id.toString() };

*/
