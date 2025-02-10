import { useEffect } from "react";
import "./App.css";
import Router from "./Router/Router";
import { RouterProvider } from "react-router";


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
   
    </div>
  );
}

export default App;