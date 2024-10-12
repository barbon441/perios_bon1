// Calendar.js
import React, { useState } from 'react';

const Calendar = ({ handleDateClick }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const onDateClick = (day) => {
    setSelectedDay(day);
    handleDateClick(day);
  };

  return (
    <div className="calendar-grid">
      {Array.from({ length: 31 }, (_, index) => {
        const day = index + 1;
        return (
          <div
            key={day}
            className={`calendar-day ${day === selectedDay ? 'bg-gray-300' : ''}`}
            onClick={() => onDateClick(day)}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
