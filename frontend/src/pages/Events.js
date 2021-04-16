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

  useEffect(() => {
    fetchEvents();
  }, [])

  const createEventHandler = () => {
    console.log('create');
    setCreatingEvent(true);
  }

  const onPressConfirm = () => {
    console.log('confirm');
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
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        fetchEvents();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onPressCancel = () => {
    console.log('cancel');
    setCreatingEvent(false);
  }

  const fetchEvents = () => {
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

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        console.log('setting events', events)
        setEvents(events);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const eventList = events.map(event => {
      return (
        <li key={event._id} className="events__list-item">
          {event.title}
        </li>
      );
    });

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
      {authContext.token && (
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={createEventHandler}>
          Create Event
        </button>
      </div>
    )}
      <ul className="events__list">{eventList}</ul>
    </>
  );
}

export default EventsPage;
