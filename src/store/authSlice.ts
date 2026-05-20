import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthTailor, TailorProfile } from "@/types/shared";

export interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  tailor?: AuthTailor | TailorProfile;
  hydrated: boolean;
}

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  tailor: undefined,
  hydrated: false,
};

interface SetAuthPayload {
  accessToken: string;
  refreshToken: string;
  tailor: AuthTailor | TailorProfile;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<SetAuthPayload>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.tailor = action.payload.tailor;
      state.hydrated = true;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
    clearAuth(state) {
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.tailor = undefined;
      state.hydrated = true;
    },
    updateTailor(state, action: PayloadAction<Partial<TailorProfile>>) {
      if (!state.tailor) return;
      state.tailor = { ...state.tailor, ...action.payload } as AuthTailor &
        Partial<TailorProfile>;
    },
  },
});

export const { setAuth, setHydrated, clearAuth, updateTailor } =
  authSlice.actions;

export default authSlice.reducer;
