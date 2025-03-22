import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


//global initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (data) => {
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/register",
      data,
      {
        withCredentials: true,
      }
    );
    console.log("register user -> ", response.data);

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (data) => {
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/login",
      data,
      {
        withCredentials: true,
      }
    );
    console.log("loged in user -> ", response.data);

    return response.data;
  }
);

export const logoutUser = createAsyncThunk("/auth/logoutUser", async () => {
  const response = await axios.post(
    "http://localhost:8000/api/v1/users/logout",
    {},
    {
      withCredentials: true,
    }
  );
  console.log("loged out user -> ", response.data);

  return response.data;
});

export const checkAuth = createAsyncThunk("/auth/checkAuth", async () => {
  const response = await axios.get(
    "http://localhost:8000/api/v1/users/check-auth",
    {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
  console.log("Auth check -> ", response.data);

  return response.data;
});

export const loginAsGuest = createAsyncThunk(
  "/auth/loginAsGuest",
  async () => {
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/guest-login",
      {},
      {
        withCredentials: true,
      }
    );
    console.log("login as a guest -> ", response.data);
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        (state.isLoading = false),
          (state.isAuthenticated = false),
          (state.user = null);
      })
      .addCase(registerUser.rejected, (state) => {
        (state.isLoading = false),
          (state.isAuthenticated = false),
          (state.user = null);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state) => {
        (state.isLoading = false),
          (state.isAuthenticated = false),
          (state.user = null);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isAuthenticated = action.payload.success),     
          console.log('001',action);
               
          (state.user = action.payload.success && action.payload.data.user);
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        (state.isLoading = false),
          (state.isAuthenticated = false),
          (state.user = null);
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isAuthenticated = action.payload.success),
          (state.user = action.payload.success && action.payload.data);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        (state.isLoading = false),
          (state.user = null),
          (state.isAuthenticated = false);
      })
      .addCase(loginAsGuest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAsGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success && action.payload.data.user;
      })
      .addCase(loginAsGuest.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
