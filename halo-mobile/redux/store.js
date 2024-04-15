import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import conversationSlice from "./conversationSlice";
export const store = configureStore({
  reducer: {
    userLogin: userSlice,
    usersInit: conversationSlice,
  },
});
