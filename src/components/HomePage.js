import React, { useState } from 'react';
import SaveButton from './SaveButton';
import './calendar.css';

const HomePage = () => {
  const [nextPeriod, setNextPeriod] = useState();
  const [cycleDates, setCycleDates] = useState([]);
  const [predictedDates, setPredictedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySymptoms, setDailySymptoms] = useState({});
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({ flow: '', mood: [], symptoms: [] });

  const handleLogSymptoms = () => setShowSymptomForm(true);

  const handleLogCycle = () => {
    const today = new Date().toISOString().split('T')[0];
    setCycleDates([...cycleDates, today]);

    const newPredictedDates = Array.from({ length: 5 }, (_, i) => {
      const nextDate = new Date();
      nextDate.setDate(new Date().getDate() + i + 1);
      return nextDate.toISOString().split('T')[0];
    });
    setPredictedDates(newPredictedDates);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedSymptoms(dailySymptoms[newDate] || { flow: '', mood: [], symptoms: [] });
  };

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

  const renderCalendar = () => (
    <div className="calendar-grid">
      {Array.from({ length: 31 }, (_, index) => (
        <div
          key={index + 1}
          className={`calendar-day ${new Date().getDate() === index + 1 ? 'bg-gray-300' : ''}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-xl"></div>
      </div>

      <div className="mt-5 text-center">
        <div className="text-lg font-bold">ประจำเดือนจะมาใน</div>
        <div className="text-6xl font-bold text-pink-500">{nextPeriod} วัน</div>
        <div className="text-sm mt-2">โอกาสตั้งครรภ์น้อย</div>
      </div>

      <h3 className="text-lg font-bold mt-5">ปฏิทินรอบเดือน</h3>
      <div className="mt-5">{renderCalendar()}</div>

      {/* เลือกวันที่ */}
      <div className="mt-5">
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      <div className="mt-5 flex justify-center">
        <SaveButton onCycleDatesChange={handleLogCycle} />
      </div>

      {/* แสดงวันที่รอบเดือน */}
      <div className="mt-10">
        <h3 className="text-lg font-bold">วันที่บันทึกรอบเดือน</h3>
        <ul>
          {cycleDates.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <div className="text-lg font-bold">ข้อมูลเชิงลึกประจำวันของฉัน - {selectedDate}</div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>บันทึกอาการของคุณ</div>
            <div className="bg-pink-500 text-white rounded-full p-2 cursor-pointer" onClick={handleLogSymptoms}>+</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>ข้อมูลเชิงลึกเฉพาะบุคคลสำหรับวันนี้</div>
          </div>
        </div>
      </div>

      {/* Show symptom selection form */}
      {showSymptomForm && (
        <div className="mt-5">
          <h3 className="text-lg font-bold">เลือกอาการที่คุณรู้สึก</h3>
          {['มามาก', 'มาปานกลาง', 'มาน้อย'].map((flow) => (
            <label className="block mt-2" key={flow}>
              <input
                type="radio"
                name="flow"
                value={flow}
                onChange={handleSymptomChange}
                checked={selectedSymptoms.flow === flow}
                className="mr-2"
              />
              {flow}
            </label>
          ))}

          <h4 className="font-bold mt-4">อารมณ์</h4>
          {['เงียบสงบ', 'มีความสุข', 'กระปรี้กระเปร่า', 'หงุดหงิด', 'เศร้า', 'กระวนกระวาย', 'หดหู่', 'รู้สึกผิด', 'ไม่กระตือรือร้น', 'สับสน', 'วิจารณ์ตัวเอง', 'อารมณ์แปรปรวน'].map((mood) => (
            <label className="block mt-2" key={mood}>
              <input
                type="checkbox"
                name="mood"
                value={mood}
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes(mood)}
                className="mr-2"
              />
              {mood}
            </label>
          ))}

          <h4 className="font-bold mt-4">อาการ</h4>
          {['ปวดประจำเดือน', 'เจ็บเต้านม', 'ปวดศีรษะ', 'อ่อนเพลีย', 'เป็นสิว', 'ปวดหลัง', 'มีความอยากอาหารสูง', 'นอนไม่หลับ'].map((symptom) => (
            <label className="block mt-2" key={symptom}>
              <input
                type="checkbox"
                name="symptoms"
                value={symptom}
                onChange={handleSymptomChange}
                checked={selectedSymptoms.symptoms.includes(symptom)}
                className="mr-2"
              />
              {symptom}
            </label>
          ))}

          <button className="bg-pink-500 text-white py-2 px-4 rounded-full mt-4" onClick={handleSaveSymptoms}>
            บันทึกอาการ
          </button>
        </div>
      )}

      {/* สรุปอาการของวันที่ที่เลือก */}
      {dailySymptoms[selectedDate] && (
        <div className="mt-10 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold">สรุปอาการของคุณ</h3>
          <p className="mt-2">ปริมาณประจำเดือน: {dailySymptoms[selectedDate].flow || 'ไม่ได้ระบุ'}</p>
          <p className="mt-2">อารมณ์: {dailySymptoms[selectedDate].mood.join(', ') || 'ไม่ได้ระบุ'}</p>
          <p className="mt-2">อาการ: {dailySymptoms[selectedDate].symptoms.join(', ') || 'ไม่ได้ระบุ'}</p>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold">บันทึกอาการของคุณแล้ว</h3>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 w-full bg-white p-4 flex justify-between items-center shadow-md">
        {['วันนี้', 'ข้อมูลเชิงลึก', 'ข้อความ', 'คู่รัก'].map((text) => (
          <div key={text} className="flex flex-col items-center">
            <div>📅</div>
            <div>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
