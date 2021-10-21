const app = require("./../app");
let check = require("./../checkMaxPerSlot");
let db = require("./../db.json");

describe("test timeslots", () => {
  describe("test timeslots by default", () => {
    let res;
    beforeEach(() => {
      res = app.getTimeSlots();
    });

    it("should be return Exactly the first day", () => {
      const time = new Date().getDate();
      expect(res[0].date.split("-")[2] * 1).toEqual(time);
    });
    it("should be return Exactly the last day", () => {
      let time = new Date();
      time.setDate(time.getDate() + 4);
      time = time.getDate();
      expect(res[res.length - 1].date.split("-")[2] * 1).toEqual(time);
    });
    it("should be return Exactly the same day", () => {
      expect(res.length).toEqual(5);
    });
    it("number of first array should be equal", () => {
      let time = new Date().setHours(20, 0, 0) - new Date() - 1;
      time = Math.floor(time / (30 * 60 * 1000));
      time = time > 0 ? time : 0;
      expect(res[0].times.length).toEqual(time);
    });
    it("number of arrays should be equal", () => {
      let time = new Date().setHours(20, 0, 0) - new Date().setHours(8, 0, 0);
      time = Math.floor(time / (30 * 60 * 1000));
      expect(res[res.length - 1].times.length).toEqual(24);
    });
  });

  describe("when we pass arguments", () => {
    let res;
    let date = new Date();
    let maxDayRange = 5;
    const serviceDelay = 1;
    const startDate = "10:00 AM";
    const endDate = "06:00 PM";
    const slotInterval = 20;

    const exc = () => {
      res = app.getTimeSlots(
        date,
        startDate,
        endDate,
        serviceDelay,
        slotInterval,
        maxDayRange
      );
    };

    it("should be return Exactly the first day", () => {
      exc();
      const time = new Date().getDate();
      expect(res[0].date.split("-")[2] * 1).toEqual(time);
    });
    it("should be return Exactly the last day", () => {
      exc();
      let time = new Date();
      time.setDate(time.getDate() + maxDayRange - 1);
      time = time.getDate();
      expect(res[res.length - 1].date.split("-")[2] * 1).toEqual(time);
    });
    it("should be return Exactly the same day", () => {
      exc();
      expect(res.length).toEqual(maxDayRange);
    });

    it("test checkMaxPerSlot", () => {
      check.checkMaxPerSlot = jest.fn();
      exc();
      expect(check.checkMaxPerSlot).toHaveBeenCalled();
    });
  });
});
