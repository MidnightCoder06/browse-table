const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

// req has to the second arg ... args has to be the first arg
module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '603bf6b75b11882f264573ab',
      event: fetchedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};

/*

mutation {
  bookEvent(eventId: "603bf74fe3ee032f3d560dae") {
    _id,
    createdAt
  }
}

{
  "data": {
    "bookEvent": {
      "_id": "603bf78ad04db62f4a8ce0d4",
      "createdAt": "2021-02-28T20:05:30.435Z"
    }
  }

mutation {
  cancelBooking(bookingId: "603bf78ad04db62f4a8ce0d4") {
    title
    creator{
      email
    }
  }
}

{
  "data": {
    "cancelBooking": {
      "title": "sample event #1",
      "creator": {
        "email": "test@test.com"
      }
    }
  }
}

query {
  bookings {
    _id,
    createdAt,
    updatedAt
  }
}

{
  "data": {
    "bookings": [
      {
        "_id": "603bfc72136f482fac6882cf",
        "createdAt": "2021-02-28T20:26:26.899Z",
        "updatedAt": "2021-02-28T20:26:26.899Z"
      }
    ]
  }
}

*/
