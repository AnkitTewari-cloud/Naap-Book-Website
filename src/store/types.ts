import type { AuthState } from "./authSlice";
import type { AppState } from "./appSlice";

export interface RootState {
  auth: AuthState;
  app: AppState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
}
