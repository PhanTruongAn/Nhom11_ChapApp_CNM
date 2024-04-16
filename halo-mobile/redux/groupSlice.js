import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  group: {},
};
export const groupSlice = createSlice({
  name: "groupInit",
  initialState,
  reducers: {
    initGroup: (state, action) => {
      state.group = action.payload;
    },
    // lastMessenger: (state, action) => {
    //   const index = state.users.findIndex(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (index !== -1) {
    //     state.users[index] = action.payload;
    //   }
    // },
  },
});
export const { initGroup } = groupSlice.actions;
export default groupSlice.reducer;
