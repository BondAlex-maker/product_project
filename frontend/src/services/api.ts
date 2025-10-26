import axios, { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: "/api",            // ⬅️ больше НЕ http://localhost:8080
  withCredentials: true,      // оставь true, если используешь cookies/refresh
  headers: { "Content-Type": "application/json" },
};

const api = axios.create(config);
export default api;
