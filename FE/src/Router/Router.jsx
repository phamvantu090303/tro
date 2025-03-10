import routerUser from "./RouterUser";
import routerAdmin from "./RouterAdmin";
import { createBrowserRouter, createRoutesFromElements } from "react-router";

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {routerUser}
      {routerAdmin}
    </>
  )
);

export default Router;
