import { createBrowserRouter } from "react-router";
import Layout from "../component/layout";
import Login from "../pages/Login/login";
import Contract from "../component/hopdong";
import Register from "../pages/Login/Register";
import Homepage from "../pages/Home/Home";
import MapComponent from "../pages/admin/home/Map";
import Search from "../pages/Search/Search";
import RoomDetails from "../pages/RoomDetails/RoomDetails";

import QuyenManagement from "../pages/admin/Quyen";
import Chat from "../component/Mess/mess";

import LoginAdmin from "../pages/admin/LoginAdmin/loginAdmin";
import HomeAdmin from "../pages/admin/home/homeAdmin";
import BillPayment from "../pages/BillPayment/BillPayment";
import VerifySuccess from "../pages/Login/VerifySuccess";

const Router = new createBrowserRouter([
  {
    path: "/Login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/",
    element: (
      <Layout>
        <Homepage />
      </Layout>
    ),
  },
  {
    path: "/Register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/verify-email",
    element: <VerifySuccess />,
  },
  {
    path: "/Search",
    element: (
      <Layout>
        <Search />
      </Layout>
    ),
  },
  {
    path: "/Details/:id",
    element: (
      <Layout>
        <RoomDetails />
      </Layout>
    ),
  },
  {
    path: "/hopdong/:maphong",
    element: (
      <Layout>
        <Contract />
      </Layout>
    ),
  },
  {
    path: "/admin/quyen",
    element: (
      <Layout>
        <QuyenManagement />
      </Layout>
    ),
  },
  {
    path: "/mess",
    element: <Chat />,
  },
  {
    path: "/admin/login",
    element: (
      <Layout>
        <LoginAdmin />
      </Layout>
    ),
  },
  {
    path: "/admin/home",
    element: <HomeAdmin />,
  },
  {
    path: "/BillPayment",
    element: (
      <Layout>
        <BillPayment />
      </Layout>
    ),
  },
]);
export default Router;
