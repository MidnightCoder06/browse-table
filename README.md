Dev Notes:

Run on localhost 3000 via nodemon which will automatically restart the server for you when code changes are made

Everything in GraphQl runs through a single endpoint, commonly called 'graphql'

The graphql language is a typed language

// query is to fetch data
// mutation to change data -> create, update or delete
// ! means can't be null ... has to return a list of strings or an empty list
    // first ! means has be Strings
// rootValue holds the resolvers, has to match the schema by name

express-graphql  //exports a middleware function that takes incoming requests and funnels them to graphql query parser

graphql         // generates graphql schema from the passed in strings

// args is a built-in object keyword, will be null in the resolver if no parameters are passed in its matching query or mutator
