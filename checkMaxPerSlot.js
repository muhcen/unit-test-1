const db = require("./db.json");
exports.checkMaxPerSlot = function (days, maxPerSlot = 2) {
  try {
    let timeSlots = [];
    db.forEach((t) => {
      if (t.usage === maxPerSlot) {
        timeSlots.push(t.time);
      }
    });
    days.forEach((day) => {
      day.times.forEach((time) => {
        if (timeSlots.includes(time)) {
          let index = day.times.indexOf(time);
          day.times.splice(index, 1);
        }
      });
    });
    return days;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
