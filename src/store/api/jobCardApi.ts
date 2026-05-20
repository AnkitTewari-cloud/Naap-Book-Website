import { baseApi } from "../baseApi";
import type {
  CreateJobCardInput,
  JobCard,
  JobStatus,
  PaginatedResult,
  UpdateJobCardInput,
  UpdateJobStatusInput,
  VoiceNote,
} from "@/types/shared";

interface ListArgs {
  from?: string;
  to?: string;
  status?: JobStatus | "not_delivered";
  customerId?: string;
  page?: number;
  limit?: number;
}

export const jobCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listJobs: builder.query<PaginatedResult<JobCard>, ListArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.from) params.set("from", args.from);
        if (args?.to) params.set("to", args.to);
        if (args?.status) params.set("status", args.status);
        if (args?.customerId) params.set("customerId", args.customerId);
        if (args?.page) params.set("page", String(args.page));
        if (args?.limit) params.set("limit", String(args.limit));
        const qs = params.toString();
        return { url: `/scheduler/jobs${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((j) => ({ type: "JobCard" as const, id: j._id })),
              { type: "JobCard" as const, id: "LIST" },
            ]
          : [{ type: "JobCard" as const, id: "LIST" }],
    }),
    getJob: builder.query<JobCard, string>({
      query: (id) => ({ url: `/scheduler/jobs/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "JobCard", id }],
    }),
    createJob: builder.mutation<JobCard, CreateJobCardInput>({
      query: (body) => ({ url: "/scheduler/jobs", method: "POST", body }),
      invalidatesTags: [{ type: "JobCard", id: "LIST" }, "Insights"],
    }),
    updateJob: builder.mutation<
      JobCard,
      { id: string; patch: UpdateJobCardInput }
    >({
      query: ({ id, patch }) => ({
        url: `/scheduler/jobs/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "JobCard", id },
        { type: "JobCard", id: "LIST" },
      ],
    }),
    removeJob: builder.mutation<{ ok: true }, string>({
      query: (id) => ({ url: `/scheduler/jobs/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "JobCard", id: "LIST" }],
    }),
    updateJobStatus: builder.mutation<
      JobCard,
      { id: string; payload: UpdateJobStatusInput }
    >({
      query: ({ id, payload }) => ({
        url: `/scheduler/jobs/${id}/status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "JobCard", id },
        { type: "JobCard", id: "LIST" },
        "Insights",
      ],
    }),
    addJobVoiceNote: builder.mutation<
      JobCard,
      { id: string; voiceNote: VoiceNote }
    >({
      query: ({ id, voiceNote }) => ({
        url: `/scheduler/jobs/${id}/voice`,
        method: "POST",
        body: voiceNote,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "JobCard", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListJobsQuery,
  useGetJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useRemoveJobMutation,
  useUpdateJobStatusMutation,
  useAddJobVoiceNoteMutation,
} = jobCardApi;
