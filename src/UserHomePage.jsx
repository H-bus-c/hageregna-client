import React, { useState, useRef, useEffect } from "react";
import { toEthiopian } from "ethiopian-date";

const ethiopianMonths = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታህሳስ", "ጥር",
  "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ",
  "ሐምሌ", "ነሃሴ", "ጳጉሜን",
];

const UserHomePage = ({ onChange }) => {
  const todayGc = new Date();
  const todayEth = toEthiopian(todayGc.getFullYear(), todayGc.getMonth() + 1, todayGc.getDate());

  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(todayEth[0]);
  const [month, setMonth] = useState(todayEth[1] - 1); // 0-indexed
  const [startDate, setStartDate] = useState(null);
  const ref = useRef(null);

  const isLeapYear = (year) => year % 4 === 3;
  const getDaysInMonth = (monthIndex) => monthIndex === 12 ? (isLeapYear(year) ? 6 : 5) : 30;

  const isPastDate = (day) => {
    if (year < todayEth[0]) return true;
    if (year === todayEth[0]) {
      if (month < todayEth[1] - 1) return true;
      if (month === todayEth[1] - 1 && day < todayEth[2]) return true;
    }
    return false;
  };

  const handleDayClick = (day) => {
    if (!isPastDate(day)) {
      const date = { year, month: month + 1, day };
      setSelectedDate(date);
      setOpen(false);
      if (onChange) onChange(date); // <-- send value to parent
    }
  };

  const handleMonthChange = (dir) => {
    let startDay = startDate;
    if (dir === "prev") {
      if (month === 0) {
        startDay -= isLeapYear(year - 1) ? 6 : 5;
        setMonth(12);
        setYear(year - 1);
      } else {
        startDay -= 2;
        setMonth(month - 1);
      }
      startDay = startDay < 1 ? startDay + 7 : startDay;
    } else {
      if (month === 12) {
        startDay += getDaysInMonth(12);
        setMonth(0);
        setYear(year + 1);
      } else {
        startDay += 2;
        setMonth(month + 1);
      }
      startDay = startDay > 7 ? startDay - 7 : startDay;
    }
    setStartDate(startDay);
  };

  const getFirstDayOfWeek = () => {
    const date = todayGc.getDay(), day = todayEth[2];
    let finalDay = 0;
    if (day < 7) finalDay = 7 - day + date;
    else {
      const minDay = 7 - (day % 7);
      finalDay = minDay + date >= 7 ? minDay + date - 7 : minDay + date;
    }
    setStartDate(finalDay + 1);
    return finalDay + 1;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", maxWidth: "300px", margin: "auto", fontFamily: "Arial" }}>
      {/* Input field */}
      <input
        type="text"
        readOnly
        value={
          !!selectedDate
            ? `${selectedDate.day} ${ethiopianMonths[selectedDate.month - 1]} ${selectedDate.year}`
            : `DD/MM/YY`
        }
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer",
          textAlign: "center",
        }}
      />
      <span style={{
        position: "absolute", right: "10px", top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none", fontSize: "18px",
      }}>
        📅
      </span>

      {/* Calendar Popup */}
      {open && (
        <div ref={ref} style={{
          position: "absolute", top: "110%", left: 0, width: "100%",
          backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "6px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginTop: "5px", animation: "fadeIn 0.3s", zIndex: 999,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
            <button onClick={() => handleMonthChange("prev")}>◀</button>
            <strong>{ethiopianMonths[month]} {year}</strong>
            <button onClick={() => handleMonthChange("next")}>▶</button>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            fontSize: "14px", fontWeight: "bold", textAlign: "center", paddingBottom: "4px"
          }}>
            {["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            gap: "3px", padding: "5px"
          }}>
            {Array.from({ length: !startDate ? getFirstDayOfWeek() : startDate }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map((day) => {
              const isToday = day === todayEth[2] && month === todayEth[1] - 1 && year === todayEth[0];
              const disabled = isPastDate(day);
              return (
                <div
                  key={day}
                  onClick={() => !disabled && handleDayClick(day)}
                  style={{
                    padding: "8px 0",
                    backgroundColor: isToday
                      ? "#4CAF50"
                      : selectedDate?.day === day &&
                        selectedDate?.month - 1 === month
                      ? "#2196F3"
                      : "#f0f0f0",
                    color: disabled
                      ? "#bbb"
                      : isToday ||
                        (selectedDate?.day === day &&
                          selectedDate?.month - 1 === month)
                      ? "#fff"
                      : "#333",
                    cursor: disabled ? "not-allowed" : "pointer",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: isToday ? "bold" : "normal",
                    userSelect: "none",
                    textAlign: "center",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* CSS animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0; transform: scale(0.95);}
            to {opacity: 1; transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
};

export default UserHomePage;
