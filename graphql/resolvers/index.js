const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

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

/* promise based approach ... TODO: write an article on the difference between this and async-await

const eventsFetchedById = eventIds => {
  return Event.find({ _id: {$in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: userFetchedById.bind(this, event.creator)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};
*/

// async-await approach
  // return is gone b/c top most promise is impliclity returned
  // this makes the code look like its running syncronously but it is actually still using promises under the hood
const eventsFetchedById = async eventIds => {
  try {
    const events = await Event.find({ _id: {$in: eventIds } })
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: userFetchedById.bind(this, event.creator)
      };
    });
  } catch(err) {
    throw err;
  }
};

/* promise chaining based approach ... TODO: write an article on the difference between this and async-await

const userFetchedById = userId => {
  return User.findById(userId).then(user => {
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: eventsFetchedById.bind(this, user._doc.createdEvents)
    };
  })
  .catch(err => {
    throw err;
  });
};

*/

// async-await approach
const userFetchedById = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: eventsFetchedById.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

/*

example query's the above functions make possible:

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


/*

events: () => {
  return Event.find().then(events => {
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: userFetchedById.bind(this, event._doc.creator)
      };
    });
  })
  .catch(err => {
    throw err;
  });
},

*/
module.exports = {
  events: async () => {
    const events = await Event.find()
    try {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: userFetchedById.bind(this, event._doc.creator)
        };
      });
    } catch(err) {
      throw err;
    }
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '603ab7dd78cfc828d1a4b7a3'
    })
    let createdEvent;
    try {
      const result = await event.save()
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: userFetchedById.bind(this, result._doc.creator)
      };
      const user = await User.findById('603ab7dd78cfc828d1a4b7a3')
      if (!user) {
        throw new Error('user not found');
      }
      user.createdEvents.push(event);
      await user.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('user exists already');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id }
    } catch (err) {
      throw err;
    }
  }
};
