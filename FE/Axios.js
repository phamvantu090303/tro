import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export { axiosInstance };
