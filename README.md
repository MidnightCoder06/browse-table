Dev Notes:

Everything in GraphQl runs through a single endpoint, commonly called 'graphql'

The graphql language is a typed query language ... you execute a query to fetch data from that endpoint

Run this project on localhost 3000 via nodemon which will automatically restart the server for you when code changes are made

express-graphQl package connects schemas and resolvers
	It also ships with `graphiql: true` so you can visit http://localhost:3000/graphql and play with the api

I am using bcryptjs to hash the passwords so they aren't stored in plain text in the database
2 args -> 1. is the password and 2. is the salt length

I am using Mongoose as schema-based solution to model the application data. It includes awesome built-in type casting and validation.

The async-await pattern is being used here instead of promise chaining.
This uses less returns b/c top most promise is implicitly returned.
This makes the code look like its running synchronously but it is actually still using promises under the hood.



TODO:
- write tests (unit, integration, end-to-end)
- more sophisticated error handling
- once add the front-end make sure you use typescript with react
- once hosted on AWS have them handle user authentication https://aws.amazon.com/cognito/
