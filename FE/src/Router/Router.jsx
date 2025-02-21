import { createBrowserRouter } from "react-router";
import Layout from "../component/layout";
import Login from "../pages/Login/login";
import Contract from "../component/hopdong";
import Register from "../pages/Login/Register";
import Homepage from "../pages/Home/Home";
import MapComponent from "../component/Map";
import Search from "../pages/Search/Search";
import RoomDetails from "../pages/RoomDetails/RoomDetails";

import QuyenManagement from "../component/admin/Quyen";
import Chat from "../component/Mess/mess";

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
    path: "/map",
    element: (
      <Layout>
        <MapComponent />
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
    element: (
      <Layout>
        <Chat />
      </Layout>
    ),
  },
]);
export default Router;
