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
  deleteMembers: (data) => {
    const url = "/delete-members";
    return axiosClient.post(url, data);
  },
  deleteGroup: (data) => {
    const url = "/delete-group";
    return axiosClient.post(url, data);
  },
  sendMessGroup: (data) => {
    const url = "/send-mess-group";
    return axiosClient.post(url, data);
  },
  getAllChatGroup: (data) => {
    const url = "/gel-all-chat-group";
    return axiosClient.post(url, data);
  },
  retrieveMessage: (data) => {
    const url = "/retrieve-message-group";
    return axiosClient.post(url, data);
  },
  deleteMessage: (data) => {
    const url = "/delete-message-group";
    return axiosClient.post(url, data);
  },
  getLatestMesGroup: (data) => {
    const url = "/get-all-group-latest-mes";
    return axiosClient.post(url, data);
  },
  leaderLeaveGroup: (data) => {
    const url = "/leader-leave-group";
    return axiosClient.post(url, data);
  },
  updateAvatarGroup: (data) => {
    const url = "/update-avatar-group";
    return axiosClient.post(url, data);
  },
};

export default groupApi;
