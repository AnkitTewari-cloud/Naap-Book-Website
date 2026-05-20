import { baseApi } from "../baseApi";
import type {
  CreateReminderInput,
  PaginatedResult,
  Reminder,
  ReminderStatus,
} from "@/types/shared";

interface ListArgs {
  status?: ReminderStatus;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const reminderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listReminders: builder.query<PaginatedResult<Reminder>, ListArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.status) params.set("status", args.status);
        if (args?.from) params.set("from", args.from);
        if (args?.to) params.set("to", args.to);
        if (args?.page) params.set("page", String(args.page));
        if (args?.limit) params.set("limit", String(args.limit));
        const qs = params.toString();
        return { url: `/scheduler/reminders${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "Reminder" as const, id: r._id })),
              { type: "Reminder" as const, id: "LIST" },
            ]
          : [{ type: "Reminder" as const, id: "LIST" }],
    }),
    createReminder: builder.mutation<Reminder, CreateReminderInput>({
      query: (body) => ({ url: "/scheduler/reminders", method: "POST", body }),
      invalidatesTags: [{ type: "Reminder", id: "LIST" }],
    }),
    updateReminder: builder.mutation<
      Reminder,
      { id: string; patch: Partial<Reminder> }
    >({
      query: ({ id, patch }) => ({
        url: `/scheduler/reminders/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Reminder", id },
        { type: "Reminder", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
} = reminderApi;
