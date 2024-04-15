import axiosClient from "./axiosClient";
import axios from "axios";
const friendApi = {
  sendAddFriend: (data) => {
    const url = "/friend-request";
    return axiosClient.post(url, data);
  },
  cancelAddFriend: (data) => {
    const url = "/cancel-add-friend";
    return axiosClient.post(url, data);
  },
  cancelAddFriendByReceiver: (data) => {
    const url = "/cancel-add-friend-by-receiver";
    return axiosClient.post(url, data);
  },
  confirmAddFriend: (data) => {
    const url = "/confirm-friend-request";
    return axiosClient.post(url, data);
  },
  deleteFriend: (data) => {
    const url = "/delete-friend";
    return axiosClient.post(url, data);
  },
};
export default friendApi;
