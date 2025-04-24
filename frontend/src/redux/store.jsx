// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, ///
    reduxState: authReducer, // 👈 TÊN NÀY QUAN TRỌNG!
  },
});

export default store;
