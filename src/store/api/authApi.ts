import { baseApi } from "../baseApi";
import type { AuthTailor, TailorProfile, UpdateMePayload } from "@/types/shared";

interface SendOtpResponse {
  phoneEnding: string;
  otpHint?: string;
}

interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  tailor: AuthTailor;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation<SendOtpResponse, { phone: string }>({
      query: (body) => ({ url: "/auth/send-otp", method: "POST", body }),
    }),
    verifyOtp: builder.mutation<
      VerifyOtpResponse,
      { phone: string; otp: string }
    >({
      query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
      invalidatesTags: ["Tailor"],
    }),
    getMe: builder.query<TailorProfile, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["Tailor"],
    }),
    updateMe: builder.mutation<TailorProfile, UpdateMePayload>({
      query: (body) => ({ url: "/auth/me", method: "PUT", body }),
      invalidatesTags: ["Tailor"],
    }),
    logout: builder.mutation<{ ok: boolean }, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useLogoutMutation,
} = authApi;
