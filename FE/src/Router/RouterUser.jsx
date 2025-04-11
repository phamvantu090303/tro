import Layout from "../layout/User/layout";
import Login from "../pages/Login/login";
import Register from "../pages/Login/Register";
import Homepage from "../pages/Home/Home";
import Search from "../pages/Search/Search";
import RoomDetails from "../pages/RoomDetails/RoomDetails";
import Contract from "../component/hopdong";
import Chat from "../component/Mess/mess";
import Favourite from "../pages/Favourite/Favourite";
import Profile from "../pages/profile/Profile";
import VerifySuccess from "../pages/Login/VerifySuccess";
import UserResendForgot from "../pages/Login/userResendForgot";
import ResetPassword from "../pages/Login/ResetPassword";
import { Route } from "react-router";
import MyRoom from "../pages/profile/myroom";

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
    <Route path="yeuthich" element={<Favourite />} />
    <Route path="profile" element={<Profile />} />
    <Route path="/my-room" element={<MyRoom />} />
  </Route>
);

export default routerUser;
