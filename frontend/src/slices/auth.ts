import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService, { User, AuthResponse } from "../services/auth.service";

// Получаем пользователя из localStorage (только на клиенте)
const user: User | null = (() => {
    if (typeof window === "undefined") return null; // SSR FIX ✅
    const u = localStorage.getItem("user");
    if (!u) return null;
    try {
        return JSON.parse(u) as User;
    } catch {
        return null;
    }
})();

// Типы для состояния
interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
}

// Async thunks
export const register = createAsyncThunk(
    "auth/register",
    async (
        { username, email, password }: { username: string; email: string; password: string },
        { dispatch, rejectWithValue }: any
    ): Promise<AuthResponse> => {
        try {
            const response = await AuthService.register(username, email, password);
            dispatch(setMessage(response.message));
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || "Registration failed";
            dispatch(setMessage(message));
            return rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (
        { username, password }: { username: string; password: string },
        { dispatch, rejectWithValue }: any
    ): Promise<{ user: User }> => {
        try {
            const data = await AuthService.login(username, password);
            return { user: data as User };
        } catch (err: any) {
            const message = err.response?.data?.message || "Login failed";
            dispatch(setMessage(message));
            return rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();
});

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_: void, { dispatch, rejectWithValue }: any): Promise<{ accessToken: string; refreshToken: string }> => {
        try {
            const data = await AuthService.refreshToken();
            return {
                accessToken: data!.accessToken!,
                refreshToken: data!.refreshToken!,
            };
        } catch (err: any) {
            const message = err.response?.data?.message || "Token refresh failed";
            dispatch(setMessage(message));
            return rejectWithValue(message);
        }
    }
);

// Initial state
const initialState: AuthState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state) => {
                state.isLoggedIn = false;
            })
            .addCase(register.rejected, (state) => {
                state.isLoggedIn = false;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
                state.isLoggedIn = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(
                refreshToken.fulfilled,
                (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
                    if (state.user) {
                        state.user.accessToken = action.payload.accessToken;
                        state.user.refreshToken = action.payload.refreshToken;
                    }
                }
            );
    },
});

export default authSlice.reducer;
