import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  users: [],
};

export const conversationSlice = createSlice({
  name: "usersChat",
  initialState,
  reducers: {
    initUsers: (state, action) => {
      state.users = action.payload;
    },
    lastMessenger: (state, action) => {
      const index = state.users.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    groupConversation: (state, action) => {
      state.users = [...state.users, ...action.payload];
    },
  },
});
export const { initUsers, lastMessenger, groupConversation } =
  conversationSlice.actions;
export default conversationSlice.reducer;
