import React from "react";
import "./App.css";
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from "./Routers/Router";

const clientId = "660993533575-63pem1ln7g5e6s4cgreboadaajuio88g.apps.googleusercontent.com";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App"></div>
      <RouterProvider router={router}></RouterProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
