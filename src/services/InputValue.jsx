import { useState, useRef, useEffect } from "react";
import { toEthiopian } from "ethiopian-date";
import { fetchDate } from "./API";
export const menuItem = () => {
  return {
    height: "50px",
    m: 0.5,
    width: "auto",
    backgroundColor: "rgba(75, 74, 75, 0.2)",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "rgba(75, 74, 75, 0.5)",
    },
  };
};

const ethiopianMonths = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታህሳስ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሃሴ",
  "ጳጉሜን",
];

export const EthiopianCalendarPicker = ({
  onChange,
  label,
  value,
  pastDay = true,
  futureDay = true,
  error = false,
  errorText = "",
  onBlur,
  name
}) => {
  
 const [serverDate, setServerDate] = useState(new Date());
  const ref = useRef(null);
const todayGc = new Date(serverDate.toLocaleString());
  const todayEth = toEthiopian(
    todayGc.getFullYear(),
    todayGc.getMonth() + 1,
    todayGc.getDate()
  );
  const [selectedDate, setSelectedDate] = useState(value);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(todayEth[0]);
  const [month, setMonth] = useState(todayEth[1] - 1); // 0-indexed
  const [startDate, setStartDate] = useState(null);
 
  const isLeapYear = (year) => year % 4 === 3;
  const getDaysInMonth = (monthIndex) =>
    monthIndex === 12 ? (isLeapYear(year) ? 6 : 5) : 30;

  const isPastDate = (day) => {
    if (year < todayEth[0]) return true;
    if (year === todayEth[0]) {
      if (month < todayEth[1] - 1) return true;
      if (month === todayEth[1] - 1 && day <= todayEth[2]) return true;
    }
    return false;
  };
  const isFutureDate = (day) => {
    if (year > todayEth[0]) return true;
    if (year === todayEth[0]) {
      if (month > todayEth[1] - 1) return true;
      if (month === todayEth[1] - 1 && day >= todayEth[2]) return true;
    }
    return false;
  };

  const handleDayClick = (day) => {
    const date = { year, month: month + 1, day };
    // Check if the date is valid (based on pastDay and futureDay logic)
    if (pastDay && isPastDate(day)) {
      setSelectedDate(date);
      setOpen(false);
      if (onChange) onChange(date); // send value to parent
      if (onBlur) onBlur(true); // Date is selected, so call onBlur with true
    } else if (futureDay && isFutureDate(day)) {
      setSelectedDate(date);
      setOpen(false);
      if (onChange) onChange(date); // send value to parent
      if (onBlur) onBlur(true); // Date is selected, so call onBlur with true
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
    const date = todayGc.getDay(),
      day = todayEth[2];
    let finalDay = 0;
    if (day < 7) finalDay = 7 - day + date;
    else {
      const minDay = 7 - (day % 7);
      finalDay = minDay + date >= 7 ? minDay + date - 7 : minDay + date;
    }
    setStartDate(finalDay + 1);
    return finalDay + 1;
  };

  const fetchData = async () => {
    try {
        const [date] = await Promise.all([fetchDate()]);
    setServerDate(new Date(date))
    } catch (error) {
      console.log(error);
    }
  
  }
  useEffect(() => {
    fetchData()
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        onBlur(true)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        margin: "auto",
        marginBottom:error?"10px":"auto",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10px",
          left: "12px",
          fontSize: "12px",
          color: error?"#c11":"#555",
          transition: "all 0.2s ease-out",
          padding: "0 4px",
          pointerEvents: "none",
          backdropFilter: "blur(100px)",
          backgroundColor: "rgb(233, 233, 233)",
        }}
      >
        <label>{label}</label>
      </div>

      {/* Input field */}
      <span
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          fontSize: "18px",
        }}
      >
        📅
      </span>
      <input
        type="text"
        name={name}
        readOnly
        value={
          !!selectedDate
            ? `${selectedDate.day} ${ethiopianMonths[selectedDate.month - 1]} ${
                selectedDate.year
              }`
            : `DD/MM/YY`
        }
        onClick={() => setOpen(!open)}
       // onBlur={()=>onBlur(!!value)}
        style={{
          width: "100%",
          height: "58px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: error?"1px solid #c11":"1px solid #777",
          cursor: "pointer",
          textAlign: "center",
          backgroundColor: "transparent",
        }}
      />

      {/* Calendar Popup */}
      {open && (
        <div
          ref={ref}
          style={{
            position: "absolute", // Use fixed positioning for a floating popup
            top: "0", // Center the calendar vertically
            left: "50%", // Center the calendar horizontally
            transform: "translate(-50%, -50%)", // Center properly
            width: "300px", // Ensure the popup width adjusts automatically
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.9)",
            zIndex: 9999, // Ensure the popup is on top
            animation: "fadeIn 0.3s",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px",
            }}
          >
            <button type="button" onClick={(e) => handleMonthChange("prev")}>
              ◀
            </button>
            <strong>
              {ethiopianMonths[month]} {year}
            </strong>
            <button type="button" onClick={(e) => handleMonthChange("next")}>
              ▶
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
              paddingBottom: "4px",
            }}
          >
            {["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "3px",
              padding: "5px",
            }}
          >
            {Array.from({
              length: !startDate ? getFirstDayOfWeek() : startDate,
            }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1).map(
              (day) => {
                const isToday =
                  day === todayEth[2] &&
                  month === todayEth[1] - 1 &&
                  year === todayEth[0];

                const disabled =
                  (pastDay && isPastDate(day)) ||
                  (futureDay && isFutureDate(day));
                return (
                  <div
                    key={day}
                    onClick={() => disabled && handleDayClick(day)}
                    style={{
                      padding: "8px 0",
                      backgroundColor: isToday
                        ? "#4CAF50"
                        : selectedDate?.day === day &&
                          selectedDate?.month - 1 === month
                        ? "#2196F3"
                        : "#f0f0f0",
                      color: !disabled
                        ? "#bbb"
                        : isToday ||
                          (selectedDate?.day === day &&
                            selectedDate?.month - 1 === month)
                        ? "#fff"
                        : "#333",
                      cursor: !disabled ? "not-allowed" : "pointer",
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
              }
            )}
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
      {error&&<div
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "12px",
          fontSize: "12px",
          color: error?"#c11":"#555",
          transition: "all 0.2s ease-out",
          padding: "0 4px",
          pointerEvents: "none",
          backdropFilter: "blur(100px)",
          backgroundColor: "rgb(233, 233, 233)",
          marginBottom:"-1px"
        }}
      >
        <label>{errorText}</label>
      </div>}
    </div>
  );
};
