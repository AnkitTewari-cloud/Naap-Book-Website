import { baseApi } from "../baseApi";
import type { InsightsSummary, KeyTakeaway } from "@/types/shared";

export const insightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    summary: builder.query<InsightsSummary, { language?: string } | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.language) params.set("language", args.language);
        const qs = params.toString();
        return { url: `/insights/summary${qs ? `?${qs}` : ""}` };
      },
      providesTags: ["Insights"],
    }),
    takeaways: builder.query<KeyTakeaway[], { language?: string } | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.language) params.set("language", args.language);
        const qs = params.toString();
        return { url: `/insights/takeaways${qs ? `?${qs}` : ""}` };
      },
      providesTags: ["Takeaway"],
    }),
    dismissTakeaway: builder.mutation<{ ok: true }, string>({
      query: (id) => ({
        url: `/insights/takeaways/${id}/dismiss`,
        method: "POST",
      }),
      invalidatesTags: ["Takeaway", "Insights"],
    }),
    regenerate: builder.mutation<{ ok: true }, void>({
      query: () => ({ url: "/insights/regenerate", method: "POST" }),
      invalidatesTags: ["Takeaway", "Insights"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSummaryQuery,
  useTakeawaysQuery,
  useDismissTakeawayMutation,
  useRegenerateMutation,
} = insightsApi;
