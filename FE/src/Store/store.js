import { configureStore } from "@reduxjs/toolkit";
import filterUser from "./filterUser";
import filterAdmin from "./filterAdmin";
import filterConfirmModal from "./filterConfirmModal";
import filterModalForm from "./filterModalForm";
const store = configureStore({
  reducer: {
    auth: filterUser,
    authAdmin: filterAdmin,
    confirmModal: filterConfirmModal,
    ModalForm: filterModalForm,
  },
});
export default store;
