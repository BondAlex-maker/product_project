import api from "./api";
import TokenService from "./token.service";
import { AxiosResponse } from "axios";

export interface User {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    accessToken?: string;
    refreshToken?: string;
    username?: string;
    email?: string;
    [key: string]: any;
}

class AuthService {
    async register(username: string, email: string, password: string): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await api.post("/auth/signup", { username, email, password });
        return response.data;
    }

    async login(username: string, password: string): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await api.post("/auth/signin", { username, password });

        if (response.data.accessToken) {
            TokenService.setUser(response.data as User);
        }

        return response.data;
    }

    async refreshToken(): Promise<AuthResponse | undefined> {
        const refreshToken = TokenService.getLocalRefreshToken();
        if (!refreshToken) return;

        const response: AxiosResponse<AuthResponse> = await api.post("/auth/refreshtoken", { refreshToken });

        if (response.data.accessToken) {
            TokenService.updateLocalAccessToken(response.data.accessToken);
            TokenService.updateLocalRefreshToken(response.data.refreshToken!);
        }

        return response.data;
    }

    async logout(): Promise<AuthResponse> {
        TokenService.removeUser();
        const response: AxiosResponse<AuthResponse> = await api.post("/auth/signout");
        return response.data;
    }

    getCurrentUser(): User | null {
        if (typeof window === "undefined") return null;
        return TokenService.getUser();
    }
}

export default new AuthService();
