const userValidate = {
  validateOTP: (otp) => {
    const regex = /^[0-9]{6}$/;
    if (!regex.test(otp)) {
      return {
        EM: "Mã OTP gồm 6 kí tự số",
      };
    }
    return {
      EC: 0,
    };
  },
};
module.exports = userValidate;
