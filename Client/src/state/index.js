import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "6639d0785aad14213379f8a3",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
