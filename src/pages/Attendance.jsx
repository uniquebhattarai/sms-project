import React, { useEffect, useState } from "react";
import DateBS from "../../utils/DateBS";

const BS_MONTH_NAMES = [
  "वैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फागुन",
  "चैत",
];

const Attendance = () => {
  const [attendance, setAttendance] = useState({});
  const [year, setYear] = useState(2082);
  const [month, setMonth] = useState(3);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  const MIN_YEAR = 2081;
  const MIN_MONTH = 1;

  // Mock attendance data
  const holidays = ["2082-03-05", "2082-03-12"]; // Public holidays (in Nepali date)
  const attendanceData = [
    { date: "2082-03-01", status: "present" },
    { date: "2082-03-02", status: "absent" },
    { date: "2082-03-03", status: "present" },
    { date: "2082-03-04", status: "present" },
    { date: "2082-03-05", status: "holiday" },
    { date: "2082-03-06", status: "present" },
    { date: "2082-03-07", status: "holiday" },
    { date: "2082-03-08", status: "absent" },
    { date: "2082-03-09", status: "present" },
    { date: "2082-03-10", status: "present" },
    { date: "2082-03-11", status: "present" },
    { date: "2082-03-12", status: "holiday" },
    { date: "2082-03-13", status: "present" },
    { date: "2082-03-14", status: "holiday" },
    { date: "2082-03-15", status: "present" },
  ];

  useEffect(() => {
    const map = {};
    attendanceData.forEach((entry) => (map[entry.date] = entry.status));
    holidays.forEach((d) => (map[d] = "holiday"));
    setAttendance(map);
  }, []);

  const days = [];
  let p = 0,
    a = 0;
  const bsInstance = new DateBS(year, month, 1);
  const daysInMonth = bsInstance.daysInMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new DateBS(year, month, day);
    const str = d.toString();
    let status = attendance[str] || null;

    // Mark Saturdays as holidays (blue)
    const adDate = d.toAD();
    if (adDate.getDay() === 6 && status === null) {
      // Saturday = 6 in JS Date getDay()
      status = "holiday";
    }

    if (status === "present") p++;
    if (status === "absent") a++;

    days.push({ bs: str, status });
  }

  useEffect(() => {
    setPresent(p);
    setAbsent(a);
  }, [attendance, year, month]);

  const handlePrevMonth = () => {
    if (month === 1) {
      if (year > MIN_YEAR) {
        setYear((prev) => prev - 1);
        setMonth(12);
      }
    } else {
      if (!(year === MIN_YEAR && month - 1 < MIN_MONTH)) {
        setMonth((prev) => prev - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((prev) => prev + 1);
      setMonth(1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevMonth}
              disabled={year === MIN_YEAR && month === MIN_MONTH}
              className={`w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 ${
                year === MIN_YEAR && month === MIN_MONTH
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              }`}
              aria-label="Previous Month"
            >
              ‹
            </button>

            <div className="text-center flex flex-col items-center flex-grow">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Attendance
              </h1>
              <div className="text-xl font-semibold text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-2 rounded-full">
                {year} - {BS_MONTH_NAMES[month - 1]}
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center text-xl font-bold"
              aria-label="Next Month"
            >
              ›
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
            <div className="grid grid-cols-7 gap-3 mb-4">
              {["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"].map(
                (d) => (
                  <div
                    key={d}
                    className="font-bold text-center text-gray-700 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"
                  >
                    {d}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {/* Blank spaces before first day of month */}
              {Array(bsInstance.toAD().getDay())
                .fill(null)
                .map((_, i) => (
                  <div key={"empty-" + i} />
                ))}

              {/* Days */}
              {days.map(({ bs, status }) => (
                <div
                  key={bs}
                  className={`text-center py-4 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg ${
                    status === "present"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      : status === "absent"
                      ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                      : status === "holiday"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500"
                  }`}
                  title={`${bs} - ${
                    status === "present"
                      ? "Present"
                      : status === "absent"
                      ? "Absent"
                      : status === "holiday"
                      ? "Holiday"
                      : "No Data"
                  }`}
                >
                  {bs.split("-")[2]}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {present}
              </div>
              <div className="text-green-600 font-semibold flex items-center justify-center gap-2">
                <span className="text-2xl">✓</span>
                Present Days
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-100 to-rose-100 rounded-2xl p-6 text-center border border-red-200">
              <div className="text-3xl font-bold text-red-700 mb-2">
                {absent}
              </div>
              <div className="text-red-600 font-semibold flex items-center justify-center gap-2">
                <span className="text-2xl">✗</span>
                Absent Days
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">
                {present + absent > 0
                  ? Math.round((present / (present + absent)) * 100)
                  : 0}
                %
              </div>
              <div className="text-blue-600 font-semibold flex items-center justify-center gap-2">
                <span className="text-2xl">📊</span>
                Attendance Rate
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
              <span className="text-gray-700">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-600 rounded"></div>
              <span className="text-gray-700">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></div>
              <span className="text-gray-700">Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
              <span className="text-gray-700">No Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
