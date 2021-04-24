import React from 'react';
import EventItem from './EventItem';
import './EventList.css';

const eventList = props => {
  const events = props.events.map((event, idx) =>
      <EventItem
        key={idx}
        title={event.title}
      />
    );
  return <ul className="event__list">{events}</ul>;
};

export default eventList;
