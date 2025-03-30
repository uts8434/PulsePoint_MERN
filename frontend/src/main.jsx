import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import AdminContextProvider from "./Admin/context/AdminContext.jsx";
import DoctorContextProvider from "./Admin/context/DoctorContext.jsx";
import AdminAppContextProvider from "./Admin/context/AdminAppContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AdminAppContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </AdminAppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
