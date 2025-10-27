import { User } from "./auth.service";

class TokenService {
    getLocalRefreshToken(): string | undefined {
        const user = this.getUser();
        return user?.refreshToken;
    }

    updateLocalRefreshToken(refreshToken: string): void {
        const user = this.getUser();
        if (user) {
            user.refreshToken = refreshToken;
            this.setUser(user);
        }
    }

    getLocalAccessToken(): string | undefined {
        const user = this.getUser();
        return user?.accessToken;
    }

    updateLocalAccessToken(token: string): void {
        const user = this.getUser();
        if (user) {
            user.accessToken = token;
            this.setUser(user);
        }
    }

    getUser(): User | null {
        if (typeof window === "undefined") return null;

        const userString = localStorage.getItem("user");
        if (!userString) return null;

        try {
            const user: User = JSON.parse(userString);
            return user;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            return null;
        }
    }

    setUser(user: User): void {
        if (typeof window === "undefined") return;

        localStorage.setItem("user", JSON.stringify(user));
    }

    removeUser(): void {
        if (typeof window === "undefined") return;

        localStorage.removeItem("user");
    }
}

export default new TokenService();
