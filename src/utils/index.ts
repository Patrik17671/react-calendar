export const helpers = {
  getNumOfPages: function (array: any[], perPage: number) {
    return Math.ceil(array.length / perPage);
  },
  getPage: function (array: any[], page: number, perPage: number) {
    var paginatedArray: any[] = [];
    var startIndex = perPage * (page - 1);
    var endIndex = startIndex + perPage;
    if (endIndex > array.length) endIndex = array.length;
    if (startIndex > array.length) return [];
    for (var i = startIndex; i < endIndex; i++) {
      paginatedArray.push(array[i]);
    }
    return paginatedArray;
  },
  stringToDate: function (date: string) {
    var day = date.split('.')[0];
    var month = date.split('.')[1];
    if (+month !== 0) month = (Number(month) - 1).toString();
    var year = date.split('.')[2];
    return new Date(Number(year), Number(month), Number(day));
  },
  isToday: function (date: string) {
    var newDate = this.stringToDate(date);
    var today = new Date();
    return (
      today.getDate() === newDate.getDate() &&
      today.getMonth() === newDate.getMonth() &&
      today.getFullYear() === newDate.getFullYear()
    );
  },
  isTomorrow: function (date: string) {
    var newDate = this.stringToDate(date);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      newDate.getDate() === tomorrow.getDate() &&
      newDate.getMonth() === tomorrow.getMonth() &&
      newDate.getFullYear() === tomorrow.getFullYear()
    );
  },
  getDayShortName: function (date: string) {
    var newDate = this.stringToDate(date);
    return newDate.toLocaleDateString('cs', { weekday: 'long' }).substring(0, 2);
  },
  generateDaysAheadFromNow: function (daysAhead: number) {
    var now = new Date();
    var days: { date: string; formattedDate: string }[] = [];
    for (var i = 0; i < daysAhead; i++) {
      var dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() + i);

      var day = dayDate.getDate();
      var month = dayDate.getMonth() + 1;
      var year = dayDate.getFullYear();
      var date = day + '.' + month + '.';
      var formattedDateWithYear = date + year;

      var dateWithYear = (function () {
        var formattedMonth = month;
        var formattedDay = day;
        if (month < 10) formattedMonth = '0' + month;
        if (day < 10) formattedDay = '0' + day;
        return year + '-' + formattedMonth + '-' + formattedDay;
      })();

      if (this.isToday(formattedDateWithYear)) {
        days.push({ date: dateWithYear, formattedDate: 'Dnes ' + date });
      } else if (this.isTomorrow(formattedDateWithYear)) {
        days.push({ date: dateWithYear, formattedDate: 'Zítra ' + date });
      } else {
        var dayShortName = this.getDayShortName(formattedDateWithYear);
        days.push({
          date: dateWithYear,
          formattedDate: dayShortName.charAt(0).toUpperCase() + dayShortName.slice(1) + ' ' + date,
        });
      }
    }
    return days;
  },
  getMinutes: function (time: string) {
    var values = time.split(':');
    var hours = values[0];
    var minutes = values[1];
    if (hours.split('')[0] === '0') {
      hours = hours.split('')[1];
    }
    if (minutes.split('')[0] === '0') {
      minutes = minutes.split('')[1];
    }
    return +hours * 60 + +minutes;
  },
  isBetweenTimes: function (startTime: string, endTime: string, time: string) {
    return (
      this.getMinutes(startTime) <= this.getMinutes(time) &&
      this.getMinutes(time) <= this.getMinutes(endTime)
    );
  },
  isBetweenTimesExcludingStart: function (startTime: string, endTime: string, time: string) {
    return (
      this.getMinutes(startTime) < this.getMinutes(time) &&
      this.getMinutes(time) <= this.getMinutes(endTime)
    );
  },
  generateRandomTimes: function () {
    const times = [];
    for (let i = 14; i <= 23; i++) {
      const total = Math.floor(Math.random() * 3) + 1; // random number between 1 and 3
      const used = Math.floor(Math.random() * total); // random number between 0 and total
      times.push({ time: `${i}:00`, availability: `(${used}/${total})` });
    }
    return times;
  },
};
