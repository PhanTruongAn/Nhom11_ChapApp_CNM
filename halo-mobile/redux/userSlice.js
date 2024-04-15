import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../api/userApi";
const initialState = {
  isAuthenticated: false,
  user: {
    friends: [],
    sendFriendRequests: [],
    friendRequests: [],
  },
};

export const userSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    friendRequest: (state, action) => {
      state.user.friendRequests = [
        ...state.user.friendRequests,
        action.payload,
      ];
    },
    cancelFriendRequest: (state, action) => {
      state.user.sendFriendRequests = state.user.sendFriendRequests.filter(
        (request) => request.phone !== action.payload.phone
      );
    },
    cancelSendFriendRequest: (state, action) => {
      state.user.friendRequests = state.user.friendRequests.filter(
        (request) => request.phone !== action.payload.phone
      );
    },
    confirmFriend: (state, action) => {
      state.user.sendFriendRequests = state.user.sendFriendRequests.filter(
        (request) => request.phone !== action.payload.phone
      );
      state.user.friends = [...state.user.friends, action.payload];
    },
    deleteFriend: (state, action) => {
      state.user.friends = state.user.friends.filter(
        (request) => request.phone !== action.payload.phone
      );
    },
  },
});
export const {
  updateUser,
  loginUser,
  friendRequest,
  cancelSendFriendRequest,
  cancelFriendRequest,
  confirmFriend,
  deleteFriend,
} = userSlice.actions;
export default userSlice.reducer;
