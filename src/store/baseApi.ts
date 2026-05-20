import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { USE_OFFLINE_MOCK_API } from "@/features/demo/demoMode";
import { mockBaseQuery } from "@/features/demo/mockBaseQuery";
import { clearAuth, setAuth } from "./authSlice";
import { webStorage } from "./localStorage";
import type { RootState } from "./types";

function resolveApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return fromEnv.trim();
  }
  return "http://localhost:4000/api/v1";
}

export const API_BASE_URL = resolveApiBaseUrl();

let refreshPromise: Promise<boolean> | null = null;

const REQUEST_TIMEOUT_MS = 15_000;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    const stateToken = (getState() as RootState).auth.accessToken;
    const token = stateToken ?? webStorage.getItem("accessToken") ?? undefined;
    if (token) headers.set("authorization", `Bearer ${token}`);
    headers.set("accept", "application/json");
    return headers;
  },
});

type RawQueryResult = Awaited<ReturnType<typeof rawBaseQuery>>;

function unwrap(res: { data?: unknown }): unknown {
  const d = res.data as { success?: boolean; data?: unknown } | undefined;
  if (d && typeof d === "object" && "success" in d && d.success && "data" in d) {
    return d.data;
  }
  return res.data;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result: RawQueryResult = await rawBaseQuery(args, api, extraOptions);
  if (result.data !== undefined) {
    result = { ...result, data: unwrap(result) } as RawQueryResult;
  }

  if (!result.error || result.error.status !== 401) return result;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken =
        (api.getState() as RootState).auth.refreshToken ??
        webStorage.getItem("refreshToken");

      if (!refreshToken) {
        api.dispatch(clearAuth());
        webStorage.clearAuth();
        return false;
      }

      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh-token", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );

      const body = refreshResult.data as
        | {
            success?: boolean;
            data?: {
              accessToken: string;
              refreshToken: string;
              tailor: unknown;
            };
          }
        | undefined;

      if (body?.success && body.data) {
        const { accessToken, refreshToken: newRefresh, tailor } = body.data;
        webStorage.setItem("accessToken", accessToken);
        webStorage.setItem("refreshToken", newRefresh);
        api.dispatch(
          setAuth({
            accessToken,
            refreshToken: newRefresh,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tailor: tailor as any,
          })
        );
        return true;
      }

      api.dispatch(clearAuth());
      webStorage.clearAuth();
      return false;
    })();
  }

  const refreshed = await refreshPromise;
  refreshPromise = null;

  if (!refreshed) return result;

  result = await rawBaseQuery(args, api, extraOptions);
  if (result.data !== undefined) {
    result = { ...result, data: unwrap(result) } as RawQueryResult;
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: USE_OFFLINE_MOCK_API ? mockBaseQuery : baseQueryWithReauth,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  keepUnusedDataFor: 120,
  tagTypes: [
    "Tailor",
    "Customer",
    "JobCard",
    "Reminder",
    "Insights",
    "Takeaway",
  ],
  endpoints: () => ({}),
});
