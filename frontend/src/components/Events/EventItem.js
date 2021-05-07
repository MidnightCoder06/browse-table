import React from 'react';
import './EventItem.css';

// check props.userId === props.creatorId to see if you are an owner or not to see if you can edit the details or not (future functionality)
const eventItem = props => (
  <li key={props.id} className="events__list-item">
    <div>
      <h1> {props.title} </h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      <button className="btn" onClick={() => props.onViewDetailPress(props.eventId)}> View Details </button>
    </div>
    <div>
      {props.description}
    </div>
  </li>
);

export default eventItem;
