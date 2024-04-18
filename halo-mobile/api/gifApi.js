import axiosClient from "./axiosClient";
import axios from "axios";
const gifApi = {
  getAllGif: (data) => {
    const url = "/get-all-gif";
    return axiosClient.post(url, data);
  },
  addGif: (data) => {
    const url = "/add-gif";
    return axiosClient.post(url, data);
  },
};
export default gifApi;
