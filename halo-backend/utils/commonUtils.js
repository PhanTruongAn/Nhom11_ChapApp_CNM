import bcrypt from "bcrypt";

const commonUtils = {
  isEmpty: (obj) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  },
  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getRandomOTP: function () {
    return this.getRandomInt(100000, 999999);
  },
};

module.exports = commonUtils;
