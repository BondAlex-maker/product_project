import axiosInstance from "./api";
import TokenService from "./token.service";
import { refreshToken } from "../slices/auth";

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = TokenService.getLocalAccessToken();
            if (token) {
                config.headers["x-access-token"] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const { dispatch } = store;
    axiosInstance.interceptors.response.use(
        res => res,
        async (err) => {
            const originalConfig = err.config;
            const publicPaths = ["/auth/signin", "/auth/signup", "/", '/home'];
            if (!publicPaths.includes(originalConfig.url) && err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        // вызываем thunk, который сам делает refresh
                        const result = await dispatch(refreshToken());
                        const { accessToken, refreshToken: newRefreshToken } = result.payload;

                        // обновляем TokenService
                        TokenService.updateLocalAccessToken(accessToken);
                        TokenService.updateLocalRefreshToken(newRefreshToken);

                        // ставим новый токен в header
                        originalConfig.headers["x-access-token"] = accessToken;

                        // повторяем исходный запрос
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

export default setup;