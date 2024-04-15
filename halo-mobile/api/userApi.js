import axiosClient from "./axiosClient";
import axios from "axios";
const userApi = {
  checkValidate: (userAccount) => {
    const url = "/checkValidate";
    return axiosClient.post(url, userAccount);
  },
  register: (userAccount) => {
    const url = "/registry";
    return axiosClient.post(url, userAccount);
  },
  login: (userAccount) => {
    const url = "/login";
    return axiosClient.post(url, userAccount);
  },
  // loginUser: async () => {
  //   const url = "/login-user";
  //   return await axiosClient.get(url);
  // },
  searchByPhone: (user) => {
    const url = "/searchByPhone";
    return axiosClient.post(url, user);
  },
  updateUser: (user) => {
    const url = "/update-user";
    return axiosClient.post(url, user);
  },
  changePassword: (user) => {
    const url = "/change-password";
    return axiosClient.post(url, user);
  },
  confirmAccount: (user) => {
    const url = "/confirm-account";
    return axiosClient.post(url, user);
  },
  sendNewOTP: (user) => {
    const url = "/new-otp";
    return axiosClient.post(url, user);
  },
  forgotPassword: (email) => {
    const url = "/forgot-password";
    return axiosClient.post(url, email);
  },
  getData: (user) => {
    const url = "/get-data";
    return axiosClient.post(url, user);
  },
};
export default userApi;
