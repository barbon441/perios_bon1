import React from 'react';

const Calendar = ({ handleDateClick }) => {
  return (
    <div className="calendar-grid">
      {Array.from({ length: 31 }, (_, index) => (
        <div
          key={index + 1}
          className="calendar-day"
          onClick={() => handleDateClick(index + 1)}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
