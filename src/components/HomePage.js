import React, { useState, useEffect } from 'react';
import SaveButton from './SaveButton';
import Calendar from './Calendar';
import SymptomForm from './SymptomForm';
import './calendar.css';
import './homePage.css';

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nextPeriod, setNextPeriod] = useState(null);
  const [cycleDates, setCycleDates] = useState([]);
  const [dailySymptoms, setDailySymptoms] = useState({});
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({ flow: '', mood: [], symptoms: [] });

  const [loggedDates, setLoggedDates] = useState([]);
  const [predictedDates, setPredictedDates] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleDateChange = (newDate) => {
    console.log("New selected date:", newDate);
    setSelectedDate(newDate);
    calculateNextPeriod(newDate);
    setIsSaved(false);
  };

  const calculateNextPeriod = (currentDate) => {
    let validDate = new Date(currentDate);

    let currentYear = validDate.getFullYear();
    if (currentYear > 2400) {
      validDate.setFullYear(currentYear - 543);
    }

    if (!isNaN(validDate)) {
      const cycleLength = 28;
      validDate.setDate(validDate.getDate() + cycleLength);

      console.log("Next period date calculated:", validDate);

      setNextPeriod(validDate);
    } else {
      console.error("Invalid date provided:", currentDate);
    }
  };

  const handleLogCycle = (date) => {
    console.log("Selected date for log cycle:", date);
    setCycleDates([date]);
    setLoggedDates([date]);
    setIsSaved(true);
  };

  const formatThaiDate = (date) => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  const handleLogSymptoms = () => setShowSymptomForm(true);

  const handleSymptomChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedSymptoms((prev) => ({
      ...prev,
      [name]: name === 'flow' ? value : checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  const handleSaveSymptoms = () => {
    setDailySymptoms({ ...dailySymptoms, [selectedDate]: selectedSymptoms });
    setShowSymptomForm(false);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="home-page-container">
      <div className="period-info-container">
        {isSaved && (
          <>
            <div className="period-info-title period-info-title-small">
              ประจำเดือน:
            </div>
            <div className="period-info-title period-info-title-large">
              วันที่ {selectedDate.getDate()}
            </div>
          </>
        )}

        {isSaved && (
          <div className="period-info-days">
            {nextPeriod ? `ประจำเดือนจะมาอีก: ${formatThaiDate(nextPeriod)}` : 'ยังไม่ได้ระบุ'}
          </div>
        )}
      </div>

      <h3 className="calendar-title">ปฏิทินรอบเดือน</h3>
      <div className="calendar-container">
        <Calendar 
          selectedDate={selectedDate} 
          handleDateChange={handleDateChange} 
          loggedDates={loggedDates} 
          predictedDates={predictedDates} 
        />
      </div>

      <div className="save-button-container">
        <SaveButton 
          selectedDate={selectedDate}
          onCycleDatesChange={handleLogCycle} 
          onPredictedDatesChange={setPredictedDates} 
        />
      </div>  

      <div className="daily-insights-container">
        <div className="daily-insights-title">ข้อมูลเชิงลึกประจำวันของฉัน - {selectedDate.toLocaleDateString('th-TH')}</div>
        <div className="insights-grid">
          <div className="insight-card">
            <div>บันทึกอาการของคุณ</div>
            <div className="add-symptom-button" onClick={handleLogSymptoms}>+</div>
          </div>
        </div>
      </div>

      {showSymptomForm && (
        <SymptomForm
          selectedSymptoms={selectedSymptoms}
          handleSymptomChange={handleSymptomChange}
          handleSaveSymptoms={handleSaveSymptoms}
        />
      )}

      {dailySymptoms[selectedDate] && (
        <div className="symptom-summary-container">
          <h3 className="symptom-summary-title">สรุปอาการของคุณ</h3>
          <p className="symptom-summary-item">ปริมาณประจำเดือน: {dailySymptoms[selectedDate].flow || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อารมณ์: {dailySymptoms[selectedDate].mood.join(', ') || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อาการ: {dailySymptoms[selectedDate].symptoms.join(', ') || 'ไม่ได้ระบุ'}</p>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="popup-title">บันทึกอาการของคุณแล้ว</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
