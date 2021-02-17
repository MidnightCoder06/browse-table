Dev Notes:

Run on localhost 3000 via nodemon which will automatically restart the server for you when code changes are made

Everything in GraphQl runs through a single endpoint, commonly called 'graphql'

The graphql language is a typed query language ... you exectue a query to fetch data

express-graphQl package connects schemas and resolvers
	It also ships with `graphiql: true` so you can visit http://localhost:3000/graphql and play with the api
  ctrl + space for autocompletion

Using bcryptjs to hash the passwords so they aren't stored in plain text in the database
2 args -> 1. is the password and 2. is the salt length 
