import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
};

const instance: AxiosInstance = axios.create(config);

export default instance;
