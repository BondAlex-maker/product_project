import axiosInstance from "./api.ts";
import TokenService from "./token.service.ts";
import { refreshToken } from "../slices/auth.ts";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Store } from "@reduxjs/toolkit";

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const setupInterceptors = (store: Store) => {
    axiosInstance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const token = TokenService.getLocalAccessToken();
            if (token && config.headers) {
                (config.headers as Record<string, string>)["x-access-token"] = token;
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    const { dispatch } = store;

    axiosInstance.interceptors.response.use(
        (res: AxiosResponse) => res,
        async (err: AxiosError) => {
            const originalConfig = err.config as ExtendedAxiosRequestConfig;
            const publicPaths = ["/auth/signin", "/auth/signup", "/", "/home"];

            if (!publicPaths.includes(originalConfig.url || "") && err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        const result = await dispatch(refreshToken() as any); // thunk result
                        const { accessToken, refreshToken: newRefreshToken } = result.payload;

                        TokenService.updateLocalAccessToken(accessToken);
                        TokenService.updateLocalRefreshToken(newRefreshToken);

                        if (originalConfig.headers) {
                            (originalConfig.headers as Record<string, string>)["x-access-token"] = accessToken;
                        }

                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }

            return Promise.reject(err);
        }
    );
};

export default setupInterceptors;
