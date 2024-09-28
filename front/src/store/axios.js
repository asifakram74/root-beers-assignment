/** @format */

import axios from "axios";
import toast from "react-hot-toast";

const Instance = axios.create({ baseURL: process.env.REACT_APP_API });

// Request interceptor for API calls
Instance.interceptors.request.use(
  async (config) => {
    config.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requesed-With, Origin",
      "Access-Control-Allow-Methods": "POST, GET, PUT, PATCH, OPTION, HEAD",
    };

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers = Object.assign(
        {
          Authorization: `Bearer ${user.token}`,
        },
        config.headers
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
Instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    // Check if error.response exists to handle network errors or others
    if (error.response) {
      if (error.response.status === 403 || error.response.status === 401) {
        toast.error(error.response.data.message);
        localStorage.removeItem("user");
        // Optionally redirect user to login page
        // window.location.replace("/");
      }
    } else {
      // Handle network errors or no response
      console.error("Network or other error:", error.message);
      toast.error("A network error occurred. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default Instance;