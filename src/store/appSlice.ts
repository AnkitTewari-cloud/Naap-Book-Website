import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SupportedLanguage, ThemeName } from "@/types/shared";

export interface AppState {
  language: SupportedLanguage;
  theme: ThemeName;
}

const initialState: AppState = {
  language: "en",
  theme: "minimal_white",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      state.language = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemeName>) {
      state.theme = action.payload;
    },
  },
});

export const { setLanguage, setTheme } = appSlice.actions;
export default appSlice.reducer;
