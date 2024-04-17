import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  group: { members: [] },
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
    deleteMember: (state, action) => {
      state.group.members = state.group.members.filter(
        (member) => member._id !== action.payload._id
      );
    },
  },
});
export const { initGroup, deleteMember } = groupSlice.actions;
export default groupSlice.reducer;
