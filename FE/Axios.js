import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 🛠 Gán token vào headers
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
