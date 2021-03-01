const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

/*

args is a built-in object keyword, will be null in the resolver if no parameters are passed in its matching query or mutator

events is a function so you may think it would be appropriate to call this getEvents but the naming convention
in graphql it is convention to name it like a prop that holds whatever the function returns

note the resolvers names must match the query and / or mutation

Graphql works were if you have a field that are quering and it is a string or an object for exmaple
then it will give that to you. If assign the value of the field you are trying to return a function
then graphql will automatically call that function for you and assign what it returns to the key.

Not an infinite loop because only called if requested

mongodb will automatically create an id
must return the promise so nodejs knows it is async. you're telling it not to return to early
save method is given to us by mongoose ... it hits the database and performs a write operation

*/


module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return transformEvent(event);
        });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '603bf6b75b11882f264573ab'
      });
      let createdEvent;
      try {
        const result = await event.save();
        createdEvent = transformEvent(result);
        const creator = await User.findById('603bf6b75b11882f264573ab');

        if (!creator) {
          throw new Error('User not found.');
        }
        creator.createdEvents.push(event);
        await creator.save();

        return createdEvent;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  };

  /*

  mutation {
    createEvent(eventInput:{title: "sample event #1", description: "test #1 if still works", price: 9.99, date: "2018-12-13T08:44:08.425Z"}) {
      _id
      creator {
        email
      }
    }
  }

  {
  "data": {
    "createEvent": {
      "_id": "603bf74fe3ee032f3d560dae",
      "creator": {
        "email": "test@test.com"
      }
    }
  }
}

  query {
    events {
      creator {
        email
        createdEvents {
          title
        }
      }
    }
  }

  query {
    events {
      creator {
        email
        createdEvents {
          title
          creator {
            email
          }
        }
      }
    }
  }

  */
