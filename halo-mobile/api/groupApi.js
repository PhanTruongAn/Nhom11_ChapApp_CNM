import axiosClient from "./axiosClient";
import axios from "axios";
const groupApi = {
  createGroup: (data) => {
    const url = "/create-group";
    return axiosClient.post(url, data);
  },
  getAllGroup: (data) => {
    const url = "/get-all-group";
    return axiosClient.post(url, data);
  },
  addMembers: (data) => {
    const url = "/add-members";
    return axiosClient.post(url, data);
  },
};

export default groupApi;
