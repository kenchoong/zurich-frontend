import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  email: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  email: null,
};

interface GoogleCredential {
  email: string;
}

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (credential: string) => {
    try {
      // Decode the Google JWT to get email
      const decoded = jwtDecode<GoogleCredential>(credential);

      // Call your API's sign-in endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/sign-in`,
        { email: decoded.email }
      );

      return {
        accessToken: response.data.issueToken.accessToken,
        email: decoded.email,
      };
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }
);

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const accessToken = localStorage.getItem("accessToken");
  const email = localStorage.getItem("email");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  return { accessToken, email };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.email = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("email");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.email = action.payload.email;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("email", action.payload.email);
      })
      .addCase(signInWithGoogle.rejected, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.email = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.email = action.payload.email;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.email = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
