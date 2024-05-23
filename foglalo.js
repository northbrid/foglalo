// ======================= //
// ======= PARSING ======= //
// ======================= //

function adjustTimeZone(d) {
  d.setTime(d.getTime()-d.getTimezoneOffset()*60*1000);
  return d;
}

function getDateFromRange(range, index) {
  var parts = range.split(" ");
  if (parts.length !== 2) {
    return false;
  }
  return adjustTimeZone(
    new Date(parts[0].split("-")[index])
  );
}

function getDateTimeFromRange(range, index) {
  var date = getDateFromRange(range, index);
  if (date === false) {
    return false;
  }
  var parts = range.split(" ");
  if (parts.length !== 2) {
    return false;
  }
  return new Date([
    date.toISOString().split("T")[0],
    parts[1].split("-")[index]+":00.000"
  ].join("T"))
}

// ====================== //
// ==== REPRESENTING ==== //
// ====================== //

function twoDigit(n) {
  return n < 10 ? "0"+n : n;
}

function dateToString(date) {
  return [
    twoDigit(date.getFullYear()),
    twoDigit(date.getMonth()+1),
    twoDigit(date.getDate()),
  ].join(".") + ".";
}

function timeToString(date) {
  return [
    twoDigit(date.getHours()),
    twoDigit(date.getMinutes())
  ].join(":");
}

function getRangeString(startEnd) {
  if (startEnd[0] === false) return false;
  if (startEnd[1] === false) return false;
  if (!startEnd[0].getTime()) return false;
  if (!startEnd[1].getTime()) return false;

  return [
    [
      dateToString(startEnd[0]),
      dateToString(startEnd[1])
    ].join("-"),
    [
      timeToString(startEnd[0]),
      timeToString(startEnd[1])
    ].join("-")
  ].join(" ");
}

// ====================== //
// === USER INTERFACE === //
// ====================== //

var ranges = [];

while(true) {
  var rangeInp = prompt([
    "Please enter a range",
    "Format: YYYY.MM.DD.-YYYY.MM.DD. HH:MM-HH:MM",
    "For example: 2021.09.01.-2021.09.30. 08:00-16:00",
    "Or press Cancel to finish adding ranges."
  ].join("\n"));

  if (rangeInp === null) {
    break;
  }

  var rangeArr = [
    getDateTimeFromRange(rangeInp, 0),
    getDateTimeFromRange(rangeInp, 1)
  ];

  var rangeStr = getRangeString(rangeArr);
  if (rangeInp === rangeStr) {
    ranges.push(rangeArr);
  }

  var parseResultStr = (rangeInp === rangeStr)
    ? "SUCCESSFULLY parsed the range!"
    : "FAILED to parse range!"

  alert([
    parseResultStr,
    "Your current ranges are:",
    ...ranges.map(r => "- "+getRangeString(r))
  ].join("\n"));
}

if (ranges.length === 0) {
  alert("No ranges were added. Script terminated.");
}
