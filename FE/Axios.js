import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authorization = localStorage.getItem("authorization");
    const token = localStorage.getItem("token");
    if (authorization) {
      config.headers.Authorization = authorization;
    } else if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInstance };
