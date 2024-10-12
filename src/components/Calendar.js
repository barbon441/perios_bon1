import React from 'react';

const Calendar = ({ selectedDate, handleDateChange }) => {
  const selectedDay = selectedDate.getDate();

  const onDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    handleDateChange(newDate);
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
