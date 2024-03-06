// Calendar.js
import React, { useState } from 'react';
import Calendar from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = date => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        selected={selectedDate}
        onChange={handleDateSelect}
      />
    </div>
  );
};

export default MyCalendar;