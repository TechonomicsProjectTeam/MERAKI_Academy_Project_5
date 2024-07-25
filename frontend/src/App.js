import React from "react";
import "./App.css";
import { RouterProvider } from 'react-router-dom';
import { router } from "./Routers/Router";

const App = () => {
  return (
    <>
      <div className="App"></div>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
