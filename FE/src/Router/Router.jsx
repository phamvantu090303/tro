import { createBrowserRouter } from "react-router";
// import Layout from "../component/layout";
// import Login from "../pages/Login/login";
import Contract from "../component/hopdong";
// import Register from "../pages/Login/Register";
// import Homepage from "../pages/Home/Home";

const Router = new createBrowserRouter([
//   {
//     path: "/Login",
//     element: (
//       <Layout>
//         <Login />
//       </Layout>
//     ),
//   },
//   {
//     path: "/",
//     element: (
//       <Layout>
//         <Homepage />
//       </Layout>
//     ),
//   },
//   {
//     path: "/Register",
//     element: (
//       <Layout>
//         <Register />
//       </Layout>
//     ),
//   },
  {
    path: "/hopdong/:maphong",
    element: (
        <Contract />
    ),
  },
]);
export default Router;