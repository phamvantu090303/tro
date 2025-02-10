import { configureStore } from "@reduxjs/toolkit";
import filterUser from "./filterUser";
const store = configureStore({
  reducer: {
    auth: filterUser,
  },
});
export default store;
