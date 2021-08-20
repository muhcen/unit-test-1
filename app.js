const moment = require("moment");
const check = require("./checkMaxPerSlot");
function getTimeSlots(
  pickupTime,
  dayStartTime = "08:00 AM",
  dayEndTime = "08:00 PM",
  serviceDelay = 2,
  slotInterval = 30,
  maxDayRange = 5
) {
  try {
    const defaultFormat = "YYYY-MM-DDTHH:mm";
    let dayStart = moment(dayStartTime, ["hh:mm A"]).format("HH:mm");
    let dayEnd = moment(dayEndTime, ["hh:mm A"]).format("HH:mm");
    let days = [];
    for (let i = 0; i < maxDayRange; i++) {
      let timeSlots = {};

      let startTime = moment(dayStart, "HH:mm").add(i, "days");
      let endTime = moment(dayEnd, "HH:mm").add(i, "days");
      timeSlots.date = moment(dayEnd, "HH:mm")
        .add(i, "days")
        .format("YYYY-MM-DD");
      let times = [];
      while (startTime < endTime) {
        let startTimeInDefaultFormat = startTime.format(defaultFormat);
        let nowInDefaultFormat = moment().format(defaultFormat);
        if (
          !pickupTime &&
          startTimeInDefaultFormat > nowInDefaultFormat &&
          startTime.isBefore(
            moment().add(maxDayRange - serviceDelay - 1, "days")
          )
        ) {
          times.push(startTimeInDefaultFormat);
        } else if (
          startTimeInDefaultFormat > nowInDefaultFormat &&
          startTime.isAfter(
            moment(moment(pickupTime).add(serviceDelay, "days")).format(
              defaultFormat
            )
          )
        ) {
          times.push(startTimeInDefaultFormat);
        }
        startTime.add(slotInterval, "minutes");
      }
      timeSlots.times = times;
      days.push(timeSlots);
    }
    days = check.checkMaxPerSlot(days);
    console.log(days);
    return days;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getTimeSlots,
};
// getTimeSlots("80-09-03T17:00", "0-8:00 AM", "35:00", 4, 60, -10);
