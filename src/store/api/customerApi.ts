import { baseApi } from "../baseApi";
import type {
  CreateCustomerInput,
  Customer,
  GarmentType,
  MeasurementSet,
  PaginatedResult,
  UpdateCustomerInput,
} from "@/types/shared";

interface ListArgs {
  search?: string;
  page?: number;
  limit?: number;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCustomers: builder.query<PaginatedResult<Customer>, ListArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.search) params.set("search", args.search);
        if (args?.page) params.set("page", String(args.page));
        if (args?.limit) params.set("limit", String(args.limit));
        const qs = params.toString();
        return { url: `/scheduler/customers${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((c) => ({ type: "Customer" as const, id: c._id })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => ({ url: `/scheduler/customers/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Customer", id }],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerInput>({
      query: (body) => ({
        url: "/scheduler/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomer: builder.mutation<
      Customer,
      { id: string; patch: UpdateCustomerInput }
    >({
      query: ({ id, patch }) => ({
        url: `/scheduler/customers/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
    removeCustomer: builder.mutation<{ ok: true }, string>({
      query: (id) => ({
        url: `/scheduler/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomerMeasurements: builder.mutation<
      Customer,
      { id: string; garmentType: GarmentType; measurement: MeasurementSet }
    >({
      query: ({ id, garmentType, measurement }) => ({
        url: `/scheduler/customers/${id}/measurements/${garmentType}`,
        method: "PUT",
        body: measurement,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Customer", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useRemoveCustomerMutation,
  useUpdateCustomerMeasurementsMutation,
} = customerApi;
