import React, { useState, useRef, useEffect, useContext } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/AuthContext';
import './Events.css';

function EventsPage() {

  const [creatingEvent, setCreatingEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const titleEl = useRef();
  const priceEl = useRef();
  const dateEl = useRef();
  const descriptionEl = useRef();
  const authContext = useContext(AuthContext);

/*
  useEffect(() => {
    fetchEvents();
  }) // get rid of this second argument and see if that fixes bug?
    // nope... still failed to fetch the events
*/

  const createEventHandler = () => {
    console.log('create'); // this runs
    setCreatingEvent(true);
  }

  const onPressConfirm = () => {
    console.log('confirm'); // this runs
    setCreatingEvent(false);
    const title = titleEl.current.value;
    const price = priceEl.current.value;
    const date = dateEl.current.value;
    const description = descriptionEl.current.value;

    if (
      title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0
    ) {
      console.log('invalid input');
      return;
    }

    // instead of title: title, price: price you can do title, price
    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    const token = authContext.token;
    console.log("token in events.js ->", token) // runs and logs sucessfully

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed to create event!');
        }
        return res.json();
      })
      .then(resData => {
        console.log("resData from event creation", resData)
        // data: {createEvent: null}
        // errors: Array(1) -> message: "User not found." -> this is probably because you are hardcoding the creator
        // once you swapped out the hard coded value events can be created now but you still can't fetch them for some reason
        fetchEvents();
      })
      .catch(err => {
        console.log(err);
      });
  };
  // {title: "Hello", price: "89.1", date: "2021-04-24T19:52", description: "Victory"}
  // Events are being sucessfully created

  const onPressCancel = () => {
    console.log('cancel'); // runs but then ... Events.js:115 POST http://localhost:8000/graphql net::ERR_CONNECTION_REFUSED
    setCreatingEvent(false);
  }

  const fetchEvents = () => {
    /*
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    const token = authContext.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed to fetch events!', res);
          // TODO: fix this ... it hits this error
          // Events.js:111 POST http://localhost:8000/graphql net::ERR_CONNECTION_REFUSED
          // TypeError: Failed to fetch -> 500
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        console.log('setting events', events) // an empty array??
        setEvents(events);
      })
      .catch(err => {
        console.log(err);
      });
    */

    // hardcoding for now until that 500 error is figured out
    const hardCodedEvents = [{title: "Hello", price: "89.1", date: "2021-04-24T19:52", description: "Victory"}]
    setEvents(hardCodedEvents)
  }

  // const eventList = events.map(event => {
  // key={event._id}
  const eventList = events.map((event, idx) =>
      <li key={idx} className="events__list-item">
        {event.title}
      </li>
    );

  return (
    <>
      {creatingEvent && <Backdrop />}
      {creatingEvent && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={onPressCancel}
          onConfirm={onPressConfirm}
        >
        <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleEl} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceEl} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateEl} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                ref={descriptionEl}
              />
            </div>
          </form>
        </Modal>
      )}
    {/*  {authContext.token && (
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={createEventHandler}>
          Create Event
        </button>
      </div>
    )} */}
    <div className="events-control">
      <p>Share your own Events!</p>
      <button className="btn" onClick={createEventHandler}>
        Create Event
      </button>
    </div>
      <ul className="events__list">{eventList}</ul>
    </>
  );
}

export default EventsPage;
