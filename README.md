Dev Notes:

# Backend

Everything in GraphQl runs through a single endpoint, commonly called 'graphql'

The graphql language is a typed query language ... you execute a query to fetch data from that endpoint

Run this project on localhost 8000 via nodemon which will automatically restart the server for you when code changes are made
	run `npm start` at the root

express-graphQl package connects schemas and resolvers
	It also ships with `graphiql: true` so you can visit http://localhost:8000/graphql and play with the api

I am using bcryptjs to hash the passwords so they aren't stored in plain text in the database
2 args -> 1. is the password and 2. is the salt length

I am using Mongoose as schema-based solution to model the application data. It includes awesome built-in type casting and validation.

The async-await pattern is being used here instead of promise chaining.
This uses less returns b/c top most promise is implicitly returned.
This makes the code look like its running synchronously but it is actually still using promises under the hood.

I am storing the auth token (`jsonwebtoken`) on the client, not storing it in the server.
The client is storing it and attaching it to subsequent requests.
The server confirms the token is valid.
The `tokenExpiration` is measured in terms of hours.
Using a middleware function to take the token from the client and decide whether to block the incoming request or not / what resolvers it can access.

# Frontend

npx create-react-app .  
The dot is needed when you have cd into a folder (not the root)

Using `react-router-dom` for routing.

Modern Web Applications are also called Single Page Applications. What does this mean?

In the past, when browsers were much less capable than today, and JavaScript performance was poor, every page was coming from a server. Every time you clicked something, a new request was made to the server and the browser subsequently loaded the new page.

Today, popularized by modern frontend JavaScript frameworks like React, an app is usually built as a single page application: you only load the application code (HTML, CSS, JavaScript) once, and when you interact with the application, what generally happens is that JavaScript intercepts the browser events and instead of making a new request to the server that then returns a new document, the client requests some JSON or performs an action on the server but the page that the user sees is never completely wiped away, and behaves more like a desktop application.

Single page applications are built in JavaScript (or at least compiled to JavaScript) and work in the browser.

Run `npm start` in the frontend folder 

# TODO:

- add a custom 404 page
- write tests (unit, integration, end-to-end) (for both front-end and back-end) (use postman)
- more sophisticated error handling
- use environment variable so the key isn't in plain text exposed on github
- implement security lessons learned from Adobe security training
- once add the front-end make sure you use typescript with react
- use scss instead of css
- aria labels and tab indexing for accessibility
- lottie for animations
- persist the token in local storage to avoid a logout occurring on refresh
