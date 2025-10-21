import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService from "../services/auth.service";

// Получаем пользователя из localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Async thunks
export const register = createAsyncThunk(
    "auth/register",
    async ({ username, email, password }, thunkAPI) => {
        try {
            const response = await AuthService.register(username, email, password);
            thunkAPI.dispatch(setMessage(response.message));
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }, thunkAPI) => {
        try {
            const data = await AuthService.login(username, password);
            return { user: data };
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();
});

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, thunkAPI) => {
        try {
            const data = await AuthService.refreshToken();
            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            };
        } catch (error) {
            const message =
                (error.response && error.response.data?.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);


// Initial state
const initialState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state, action) => {
                state.isLoggedIn = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoggedIn = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.accessToken = action.payload.accessToken;
                    state.user.refreshToken = action.payload.refreshToken;
                }
            });
    },
});

// Export reducer
export default authSlice.reducer;
