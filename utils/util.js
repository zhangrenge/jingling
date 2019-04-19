const formatDateMine = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
  //+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeMine = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute].map(formatNumber).join(':')
  //return  [hour, minute, second].map(formatNumber).join(':')
}

const getDays = (startTime, endTime) => {
  var seconds = Date.parse(endTime) - Date.parse(startTime);
  var days = Math.floor(seconds / 1000 / 3600 / 24);
  var last = (seconds / 1000 / 3600 / 24) % 1;
  if (last > 0.25) {
    days += 1;
  } else if (last <= 0.25 && last > 0.01) {
    days += 0.5;
  } else {
    days += 0;
  }
  return days;
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNowDate() {

  var date = new Date;
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return month + "月" + day + "日"
}

function formatAfterDate() {

  var date = new Date;
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()+1

  return [year, month, day].map(formatNumber).join('/') 
}
function formatNowTime() {

  var date = new Date;

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute].map(formatNumber).join(':')
}

function formatDate() {

  var date = new Date;
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function calLeaveDays(sDate, eDate, sm, em) {
  var sDate = new Date($("#startDate").val());
  var eDate = new Date($("#endDate").val());
  var d = 0;
  while (sDate.getDate() != eDate.getDate() || sDate.getMonth() != eDate.getMonth()) {
    sDate.setDate(sDate.getDate() + 1);
    if (sDate.getDay() == 6 || sDate.getDay() == 0) {
      continue;
    }
    d++;
  }
  d--;
  if ("am" == sm) {
    ("am" == em) ? d = d + 1.5 : d = d + 2;
  } else {
    ("am" == em) ? d = d + 1 : d = d + 1.5;
  }
  return d;
}

const getHolidayDays = (startTime, endTime, sm, em) => {
  var sDate = new Date(startTime);
  var eDate = new Date(endTime);
  var d = 0;
  while (sDate.getDate() != eDate.getDate() || sDate.getMonth() != eDate.getMonth()) {
    sDate.setDate(sDate.getDate() + 1);
    if (sDate.getDay() == 6 || sDate.getDay() == 0) {
      continue;
    }
    d++;
  }
  d--;
  if ("上午" == sm) {
    ("上午" == em) ? d = d + 1.5 : d = d + 2;
  } else {
    ("上午" == em) ? d = d + 1 : d = d + 1.5;
  }
  return d;
}

const getBusinessDays = (startTime, endTime, sm, em) => {
  var sDate = new Date(startTime);
  var eDate = new Date(endTime);
  var d = 0;
  while (sDate.getDate() != eDate.getDate() || sDate.getMonth() != eDate.getMonth()) {
    sDate.setDate(sDate.getDate() + 1);
    d++;
  }
  d--;
  if ("上午" == sm) {
    ("上午" == em) ? d = d + 1.5 : d = d + 2;
  } else {
    ("上午" == em) ? d = d + 1 : d = d + 1.5;
  }

  return d;
}

/**
 * 天+1
 * @param  {[type]} dateTime [description]
 * @return {[type]}      [description]
 */
function formatDaySumOne(dateTime) {
  var date = new Date(dateTime);
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate() + 1;
  return [year, month, day].map(formatNumber).join('/') 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatDateMine: formatDateMine,
  formatTimeMine: formatTimeMine,
  getDays: getDays,
  getBusinessDays: getBusinessDays,
  getHolidayDays: getHolidayDays,
  formatTime: formatTime,
  formatNowDate: formatNowDate,
  formatNowTime: formatNowTime,
  formatDate: formatDate,
  calLeaveDays: calLeaveDays,
  formatAfterDate: formatAfterDate,
  formatDaySumOne: formatDaySumOne
}
