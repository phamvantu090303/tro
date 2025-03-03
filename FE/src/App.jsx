import { useEffect } from "react";
import "./App.css";
import Router from "./Router/Router";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";

function App() {
  useEffect(() => {
    const controller = new AbortController();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <div>
      <RouterProvider router={Router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
