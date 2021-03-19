import React, { useState } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';

function EventsPage() {

  const [creatingEvent, setCreatingEvent] = useState(false);

  const createEventHandler = () => {
    console.log('create');
    setCreatingEvent(true);
  }

  const onPressConfirm = () => {
    console.log('confirm');
    setCreatingEvent(false);
  }

  const onPressCancel = () => {
    console.log('cancel');
    setCreatingEvent(false);
  }

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
          <p>Modal Content</p>
        </Modal>
      )}
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={createEventHandler}>
          Create Event
        </button>
      </div>
    </>
  );
}

export default EventsPage;
