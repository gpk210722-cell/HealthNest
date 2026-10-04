import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App";
import "./index.css";


const token = localStorage.getItem("healthnest_token");

if (token) {
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${token}`;
}


axios.interceptors.request.use(
  (config) => {

    const currentToken =
      localStorage.getItem("healthnest_token");

    if (currentToken) {
      config.headers.Authorization =
        `Bearer ${currentToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);