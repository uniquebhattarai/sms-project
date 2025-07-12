export const BSMonths = [
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2081
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2082
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2083
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2084
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2085
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2086
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2087
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2088
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2089
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2090
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2091
  ];
  
  class DateBS {
    constructor(year, month, day) {
      this.year = year;
      this.month = month;
      this.day = day;
      return this;
    }
  
    static fromString(datestring) {
      let [y, m, d] = datestring.split("-").map(Number);
      return new DateBS(y, m, d);
    }
  
    toString() {
      return `${this.year}-${String(this.month).padStart(2, "0")}-${String(this.day).padStart(2, "0")}`;
    }
  
    dayOfYear() {
      return this.monthsInYear().slice(0, this.month - 1).reduce((a, b) => a + b, 0) + this.day;
    }
  
    static daysInYear(year) {
      return this.monthsInYear(year).reduce((a, b) => a + b, 0);
    }
  
    daysSince(date = new DateBS(2081, 1, 1)) {
      let days = 0;
      for (let y = date.year; y < this.year; y++) {
        days += DateBS.daysInYear(y);
      }
      days += this.dayOfYear() - date.dayOfYear();
      return days;
    }
  
    add(days) {
      while (days > 0) {
        const dim = this.daysInMonth();
        const remain = dim - this.day + 1;
        if (days >= remain) {
          days -= remain;
          this.day = 1;
          if (this.month === 12) {
            this.month = 1;
            this.year++;
          } else {
            this.month++;
          }
        } else {
          this.day += days;
          days = 0;
        }
      }
      return this;
    }
  
    toAD() {
      const start = new Date("1944-01-01T00:00");
      start.setDate(start.getDate() + this.daysSince());
      return start;
    }
  
    static fromAD(date = new Date()) {
      const start = new Date("1944-01-01T00:00");
      const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24));
      const bs = new DateBS(2081, 1, 1);
      return bs.add(diff);
    }
  
    static monthsInYear(year) {
      const idx = year - 2081;  // Adjusted to start from 2081
      if (idx >= 0 && idx < BSMonths.length) return BSMonths[idx];
      throw new Error("BS year out of range");
    }
  
    monthsInYear() {
      return DateBS.monthsInYear(this.year);
    }
  
    daysInMonth() {
      return DateBS.monthsInYear(this.year)[this.month - 1];
    }
  }
  
  export default DateBS;
  