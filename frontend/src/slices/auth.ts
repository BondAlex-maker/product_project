import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService, { User, AuthResponse } from "../services/auth.service";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = { isLoggedIn: false, user: null };

export const hydrateAuthFromStorage = createAsyncThunk<User | null>(
  "auth/hydrate",
  async () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }: { username: string; email: string; password: string }, { dispatch, rejectWithValue }: any): Promise<AuthResponse> => {
    try {
      const response = await AuthService.register(username, email, password);
      dispatch(setMessage(response.message));
      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message || "Registration failed";
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: { username: string; password: string }, { dispatch, rejectWithValue }: any): Promise<{ user: User }> => {
    try {
      const data = await AuthService.login(username, password);
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(data));
      return { user: data as User };
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed";
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logout();
  if (typeof window !== "undefined") localStorage.removeItem("user");
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_: void, { dispatch, rejectWithValue }: any): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const data = await AuthService.refreshToken();
      return { accessToken: data!.accessToken!, refreshToken: data!.refreshToken! };
    } catch (err: any) {
      const message = err?.response?.data?.message || "Token refresh failed";
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(hydrateAuthFromStorage.fulfilled, (state, { payload }) => {
      state.user = payload; state.isLoggedIn = !!payload;
    });
    b.addCase(register.fulfilled, (s) => { s.isLoggedIn = false; });
    b.addCase(register.rejected, (s) => { s.isLoggedIn = false; });
    b.addCase(login.fulfilled, (s, { payload }) => { s.isLoggedIn = true; s.user = payload.user; });
    b.addCase(login.rejected, (s) => { s.isLoggedIn = false; s.user = null; });
    b.addCase(logout.fulfilled, (s) => { s.isLoggedIn = false; s.user = null; });
    b.addCase(refreshToken.fulfilled, (s, { payload }) => {
      if (s.user) {
        s.user.accessToken = payload.accessToken;
        s.user.refreshToken = payload.refreshToken;
        if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(s.user));
      }
    });
  },
});

export default slice.reducer;
