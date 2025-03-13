import Layout from "../layout/User/layout";
import Login from "../pages/Login/login";
import Register from "../pages/Login/Register";
import Homepage from "../pages/Home/Home";
import Search from "../pages/Search/Search";
import RoomDetails from "../pages/RoomDetails/RoomDetails";
import Contract from "../component/hopdong";
import Chat from "../component/Mess/mess";
import BillPayment from "../pages/BillPayment/BillPayment";
import RepairRequests from "../pages/RepairRequests/RepairRequests";
import Favourite from "../pages/Favourite/Favourite";
import Profile from "../pages/profile/Profile";
import VerifySuccess from "../pages/Login/VerifySuccess";
import UserResendForgot from "../pages/Login/userResendForgot";
import ResetPassword from "../pages/Login/ResetPassword";
import { Route } from "react-router";

const routerUser = (
  <Route path="/" element={<Layout />}>
    <Route index element={<Homepage />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="verify-email" element={<VerifySuccess />} />
    <Route path="resend-forgot-password" element={<UserResendForgot />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="search" element={<Search />} />
    <Route path="details/:id" element={<RoomDetails />} />
    <Route path="hopdong/:maphong" element={<Contract />} />
    <Route path="mess" element={<Chat />} />
    <Route path="billpayment" element={<BillPayment />} />
    <Route path="suachua" element={<RepairRequests />} />
    <Route path="yeuthich" element={<Favourite />} />
    <Route path="profile" element={<Profile />} />
  </Route>
);

export default routerUser;
