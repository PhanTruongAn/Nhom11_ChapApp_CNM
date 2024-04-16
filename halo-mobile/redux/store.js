import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import conversationSlice from "./conversationSlice";
import groupSlice from "./groupSlice";
export const store = configureStore({
  reducer: {
    userLogin: userSlice,
    usersInit: conversationSlice,
    groupsInit: groupSlice,
  },
});
