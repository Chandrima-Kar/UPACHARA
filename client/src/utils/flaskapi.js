import axios from "axios";

const flaskapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FLASK_API_URL,
});

flaskapi.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

flaskapi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("profile");
        window.localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default flaskapi;
