// EventForm.js
import React, { useState } from 'react';

const EventForm = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    onSave({ title, startTime, endTime });
    setTitle('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div>
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="text" placeholder="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} />
      <input type="text" placeholder="End Time" value={endTime} onChange={e => setEndTime(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EventForm;
