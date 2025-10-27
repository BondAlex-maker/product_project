import axios, { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: "/api",           
  withCredentials: true,     
  headers: { "Content-Type": "application/json" },
};

const api = axios.create(config);
export default api;
