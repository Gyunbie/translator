import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  en: [],
  tr: [],
};

export const translateSlice = createSlice({
  name: "translate",
  initialState,
  reducers: {
    addToEn: (state, action) => {
      state.en.unshift(action.payload);
    },
    addToTr: (state, action) => {
      state.tr.unshift(action.payload);
    },
  },
});

export const { addToEn, addToTr } = translateSlice.actions;

export default translateSlice.reducer;
