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

// ====================== //
// ==== NOTIFICATION ==== //
// ====================== //

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
function publishSNSMessage() {
  var sns_client = new AWS.SNS({
    apiVersion: 'latest',
    region: "eu-central-1",
    credentials: {
      accessKeyId: "ASIATCKAPVRXCDM2RNNK",
      secretAccessKey: "uk07SPDf+3Gz6Q1NT4hLe9Z7g4kKX+bRVYUEoAHp",
      sessionToken: "IQoJb3JpZ2luX2VjEBYaDGV1LWNlbnRyYWwtMSJIMEYCIQD3a11AT+pGpE9Ntk06FJZJe08PiRoc7IFywK0lOERaqAIhANsIEw6xbkfLJvxyDCKabfUcrGa14t3byuMZVSsOpw9FKqoCCI///////////wEQABoMMjExMTI1NTEzMzI2Igw/YD0BB6d2ljkb43sq/gGavoMOHXhKkq7ZaLQeY/FGPPNYt9JwkOKLD1jjtR520gQDK7uwK2cs0oyyztuPa6QIEmllLje/mDHlPcc3+Kj9OYqvcZ0qtHEv4xCc9qeWtPKpeFZH7LX/gBeP6mBBM40TELPEH0uDa0cGJQXEa+4Rxqoz4WuJrwAQ9wrFBvV+zJJUU6y5WzFlhl7kGYecDv/XHkGGyi4ojkAc84L6kv92EyHa2kDfK4HASybyFRBz2F/hFrnF2HoWi4kXhEq4jHwIq5O9TUJ4d6Tf+w7XyF/Sc913SgnFxmfp5EEX7XIgAQMZ5iOY/q+8HLPE5DO6sAt/lj0ytZ3VtWRK7jPOXzD8v8KyBjqcAaxenNtzJRV934VVNsMx3m01gLHDL6jM9aP2v/gdcExjIVGkQcT5lvHlnEdUiPjD4Iu32yrNAGlRhc0DV0ImCzCUniLWceFBTg4iXNsvp/uydHiV+WdwRK3tBZIsARe2rz8Ev1KLS+4SyeAKEtZfn5XEzgCXwxXrNr8DPfmB1+s3Bgy4XsAqd0q813qeAjahXyYhhVMPUeaavPRgHw=="
    }
  });
  sns_client.publish({
    Message: "Szia Norman, talaltam egy idopontot, nezd meg legyszives!",
    TopicArn: "arn:aws:sns:eu-central-1:211125513326:foglalo_notification_topic"
  }, function(err, data) {
    console.log(err, data);
    window.last_error = err;
    if (err) { console.log(err.message); }
  });
}

// ====================== //
// ===== AUTOMATION ===== //
// ====================== //
var finished = false;
var currentWeek = true;
var skipCounter = 0;

function selectTimeSlotIfAny() {
  var timeSlots = document.querySelectorAll('.time-slots td.success button[type="submit"]');
  for(slot of timeSlots) {

    // parse slot date
    var slotDate = new Date([
      slot.value.substr(0,4), "-",
      slot.value.substr(4,2), "-",
      slot.value.substr(6,2), "T",
      slot.value.substr(8,2), ":",
      slot.value.substr(10,2), ":00.000"
    ].join(""))

    // check ranges
    var foundMatchingRange = false;
    for(range of ranges) {

      // check for year matching
      if (slotDate.getFullYear() < range[0].getFullYear()) continue;
      if (slotDate.getFullYear() > range[1].getFullYear()) continue;

      // check for month matching
      if (range[0].getFullYear() === range[1].getFullYear()) {
        if (slotDate.getMonth() < range[0].getMonth()) continue;
        if (slotDate.getMonth() > range[1].getMonth()) continue;
      } else if (slotDate.getFullYear() === range[0].getFullYear()) {
        if (slotDate.getMonth() < range[0].getMonth()) continue;
      } else if (slotDate.getFullYear() === range[1].getFullYear()) {
        if (slotDate.getMonth() > range[1].getMonth()) continue;
      }

      // check for day matching
      if (range[0].getFullYear() === range[1].getFullYear()) {
        if (range[0].getMonth() === range[1].getMonth()) {
          if (slotDate.getDate() < range[0].getDate()) continue;
          if (slotDate.getDate() > range[1].getDate()) continue;
        } else if (slotDate.getMonth() === range[0].getMonth()) {
          if (slotDate.getDate() < range[0].getDate()) continue;
        } else if (slotDate.getMonth() === range[1].getMonth()) {
          if (slotDate.getDate() > range[1].getDate()) continue;
        }
      } else if (slotDate.getFullYear() === range[0].getFullYear()) {
        if (slotDate.getMonth() === range[0].getMonth()) {
          if (slotDate.getDate() < range[0].getDate()) continue;
        }
      } else if (slotDate.getFullYear() === range[1].getFullYear()) {
        if (slotDate.getMonth() === range[1].getMonth()) {
          if (slotDate.getDate() > range[1].getDate()) continue;
        }
      }

      // check for hours matching
      if (slotDate.getHours() < range[0].getHours()) continue;
      if (slotDate.getHours() > range[1].getHours()) continue;

      // check for minutes matching
      if (range[0].getHours() === range[1].getHours()) {
        if (slotDate.getMinutes() < range[0].getMinutes()) continue;
        if (slotDate.getMinutes() > range[1].getMinutes()) continue;
      } else if (slotDate.getHours() === range[0].getHours()) {
        if (slotDate.getMinutes() < range[0].getMinutes()) continue;
      } else if (slotDate.getHours() === range[1].getHours()) {
        if (slotDate.getMinutes() > range[1].getMinutes()) continue;
      }

      foundMatchingRange = true;
      break;
    }

    if (foundMatchingRange) {
      slot.click();
      finished = true;
      publishSNSMessage();
      return true;
    }
  }

  return false;
}

function goToNextWeekIfMakesSense() {
  var occupiedCount = document.querySelectorAll(".time-slots td.success");
  var freeCount = document.querySelectorAll(".time-slots td.danger");

  // week if not open yet, does not make sense to view the next
  if (!currentWeek && (occupiedCount.length + freeCount.length === 0)) {
    console.log("No time slots found, not going to the next week...");
    return false;
  }

  // navigate to the next week if possible
  var nextButtons = document.querySelectorAll(".time-slots-header .next a");
  if (nextButtons.length > 0) {
    currentWeek = false;
    nextButtons[0].click();
    return true;
  }

  return false;
}

function goBackToCurrentWeek() {
  var currentButtons = document.querySelectorAll(".time-slots-header .current a");
  if (currentButtons.length > 0) {
    currentWeek = true;
    currentButtons[0].click();
    return true;
  }
  return false;
}

function isLoading() {
  var loader = document.querySelector('.loader');
  return getComputedStyle(loader, ':before').getPropertyValue('content') !== "none";
}

function step() {
  if (finished || isLoading()) {
    return;
  }

  if (skipCounter > 0) {
    skipCounter--;
    return;
  }

  if (selectTimeSlotIfAny()) return;
  if (goToNextWeekIfMakesSense()) return;
  if (goBackToCurrentWeek()) {
    skipCounter = 10;
    return;
  }

  console.log("Neither action was taken...")
}

// 30 seconds would be good
setInterval(step, 3000);
