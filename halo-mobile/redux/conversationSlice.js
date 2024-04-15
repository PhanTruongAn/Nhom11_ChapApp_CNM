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
  },
});
export const { initUsers, lastMessenger } = conversationSlice.actions;
export default conversationSlice.reducer;
