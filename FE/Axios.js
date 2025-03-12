import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const authorization = localStorage.getItem("authorization");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (authorization) {
      config.headers.Authorization = `${authorization}`;
    } else {
      console.log("token không tồn tại");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
