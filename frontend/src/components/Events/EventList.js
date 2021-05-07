import React from 'react';
import EventItem from './EventItem';
import './EventList.css';

// TODO: use the event id once the connection to the backend is fixed
const eventList = props => {
  console.log("props", props)
  const events = props.events.map((event, idx) =>
      <EventItem
        key={idx}
        title={event?.title}
        description={event?.description}
        price={event?.price}
        date={event.date}
        userId={props.authUserId}
        onViewDetailPress={props.onViewDetailPress}
        creatorId={event?.creator?._id}
      />
    );
  return <ul className="event__list">{events}</ul>;
};

export default eventList;
