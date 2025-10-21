import api from "./api";
import TokenService from "./token.service";

class AuthService {
    async register(username, email, password) {
        const response = await api.post("/auth/signup", { username, email, password });
        return response.data;
    }

    async login(username, password) {
        const response = await api.post("/auth/signin", { username, password });

        if (response.data.accessToken) {
            TokenService.setUser(response.data); // сохраняем user + токены
        }

        return response.data;
    }

    async refreshToken() {
        const refreshToken = TokenService.getLocalRefreshToken();
        if (!refreshToken) return;

        const response = await api.post("/auth/refreshtoken", { refreshToken });

        if (response.data.accessToken) {
            TokenService.updateLocalAccessToken(response.data.accessToken);
            TokenService.updateLocalRefreshToken(response.data.refreshToken);
        }

        return response.data;
    }

    async logout() {
        TokenService.removeUser();
        const response = await api.post("/auth/signout");
        return response.data;
    }

    getCurrentUser() {
        return TokenService.getUser();
    }
}

export default new AuthService();
