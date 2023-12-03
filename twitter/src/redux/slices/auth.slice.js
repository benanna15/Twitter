
import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("tokenBlog");

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    fetchAuth: storedToken
      ? {
          id: parseInt(localStorage.getItem("id")),
          email: "",
          token: storedToken,
          pseudo: localStorage.getItem("pseudo"),
          image:localStorage.getItem("image")
        }
      : null,
  },
  reducers: {
    setAuth: (state, { payload }) => {
      state.fetchAuth = {
        id: payload.id,
        email: payload.email,
        token: payload.token,
        pseudo: payload.pseudo,
        image: payload.image,
      }},
    clearAuth: (state) => {
      state.fetchAuth = null;
      localStorage.removeItem("tokenBlog");
      localStorage.removeItem("id");
      localStorage.removeItem("image");
      localStorage.removeItem("pseudo");
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export const getAuth = (state) => state.auth.fetchAuth;

export const getPseudo = (state) => state.auth.fetchAuth?.pseudo;

export const getImage = (state) => state.auth.fetchAuth?.image;

export const getToken = (state) => state.auth.fetchAuth?.token;

export default authSlice.reducer;
