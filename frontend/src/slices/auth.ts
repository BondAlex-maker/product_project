import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "./message.ts";
import AuthService, { User, AuthResponse } from "../services/auth.service.ts";

// Получаем пользователя из localStorage
const user: User | null = (() => {
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
export const register = createAsyncThunk<AuthResponse, { username: string; email: string; password: string }, { rejectValue: string }>(
    "auth/register",
        async ({ username, email, password }, thunkAPI) => {
            try {
                const response = await AuthService.register(username, email, password);
                thunkAPI.dispatch(setMessage(response.message));
                return response;
            } catch (error: any) {
                const message =
                    error.response?.data?.message || error.message || error.toString();
                thunkAPI.dispatch(setMessage(message));
                return thunkAPI.rejectWithValue(message);
            }
        }
);

export const login = createAsyncThunk<{ user: User }, { username: string; password: string }, { rejectValue: string }>(
    "auth/login",
        async ({ username, password }, thunkAPI) => {
            try {
                const data = await AuthService.login(username, password);
                return { user: data as User };
            } catch (error: any) {
                const message =
                    error.response?.data?.message || error.message || error.toString();
                thunkAPI.dispatch(setMessage(message));
                return thunkAPI.rejectWithValue(message);
            }
        }
);

export const logout = createAsyncThunk<void>("auth/logout", async () => {
    await AuthService.logout();
});

export const refreshToken = createAsyncThunk<{ accessToken: string; refreshToken: string }, void, { rejectValue: string }>(
    "auth/refreshToken",
        async (_, thunkAPI) => {
            try {
                const data = await AuthService.refreshToken();
                return {
                    accessToken: data!.accessToken!,
                    refreshToken: data!.refreshToken!,
            };
            } catch (error: any) {
                const message =
                    error.response?.data?.message || error.message || error.toString();
                thunkAPI.dispatch(setMessage(message));
                return thunkAPI.rejectWithValue(message);
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
            .addCase(refreshToken.fulfilled, (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
                if (state.user) {
                    state.user.accessToken = action.payload.accessToken;
                    state.user.refreshToken = action.payload.refreshToken;
                }
            });
    },
});

// Export reducer
export default authSlice.reducer;
