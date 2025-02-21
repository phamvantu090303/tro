import { configureStore } from "@reduxjs/toolkit";
import filterUser from "./filterUser";
import filterAdmin from "./filterAdmin";

const store = configureStore({
  reducer: {
    auth: filterUser,
    authAdmin:filterAdmin,
  },
});
export default store;
