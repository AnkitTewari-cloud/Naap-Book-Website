import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type {
  AuthTailor,
  Customer,
  JobCard,
  JobStatus,
  KeyTakeaway,
  PaginatedResult,
  Reminder,
} from "@/types/shared";
import {
  demoCustomers,
  demoJobs,
  demoReminders,
  demoTailor,
  mutators,
} from "./demoFixtures";
import { DEMO_SKIP_LOGIN } from "./demoMode";
import { POC_OTP, POC_PHONE_E164 } from "./demoCredentials";
import { DEMO_INSIGHTS_SUMMARY } from "@/features/insights/data/demoInsights";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ok<T>(data: T): { data: T } {
  return { data };
}

function notFound(msg = "Demo: not implemented"): { error: FetchBaseQueryError } {
  return {
    error: {
      status: 404,
      data: { success: false, error: { code: "NOT_FOUND", message: msg } },
    } as unknown as FetchBaseQueryError,
  };
}

function genId(): string {
  return Math.random().toString(36).slice(2, 12);
}

function nowIso(): string {
  return new Date().toISOString();
}

function paginate<T>(
  items: T[],
  page = 1,
  limit = 50
): PaginatedResult<T> {
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  return {
    items: slice,
    page,
    limit,
    total: items.length,
    hasMore: start + slice.length < items.length,
  };
}

interface ParsedUrl {
  path: string;
  segments: string[];
  query: URLSearchParams;
}

function parseUrl(raw: string): ParsedUrl {
  const [rawPath, rawQs = ""] = raw.split("?");
  const cleaned = (rawPath ?? "")
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/+/, "")
    .replace(/^api\/v1\/?/, "")
    .replace(/^\/+/, "");
  const segments = cleaned.split("/").filter(Boolean);
  return {
    path: "/" + segments.join("/"),
    segments,
    query: new URLSearchParams(rawQs),
  };
}

// Strip a leading "/scheduler" segment because the real API uses it but the
// task spec describes paths without it; we accept both.
function withoutSchedulerPrefix(segments: string[]): string[] {
  if (segments[0] === "scheduler") return segments.slice(1);
  return segments;
}

function isAuthTokens(b: unknown): b is { accessToken: string; refreshToken: string; tailor: AuthTailor } {
  return !!b && typeof b === "object" && "accessToken" in (b as object);
}

// ---------------------------------------------------------------------------
// Auth handlers
// ---------------------------------------------------------------------------

function handleAuth(
  segments: string[],
  method: string,
  body: Record<string, unknown> | undefined
) {
  const action = segments[1] ?? "";

  if (action === "send-otp" && method === "POST") {
    const phone = (body?.phone as string | undefined) ?? "0000000000";
    return ok({
      phoneEnding: phone.slice(-4),
      otpHint: `POC OTP: ${POC_OTP}`,
    });
  }

  if (action === "verify-otp" && method === "POST") {
    const phone = String(body?.phone ?? "").trim();
    const otp = String(body?.otp ?? "").trim();
    if (!DEMO_SKIP_LOGIN && (phone !== POC_PHONE_E164 || otp !== POC_OTP)) {
      return {
        error: {
          status: 400,
          data: {
            success: false,
            error: {
              code: "POC_BAD_CREDENTIALS",
              message: `Use phone ${POC_PHONE_E164.slice(3)} + OTP ${POC_OTP}`,
            },
          },
        } as unknown as FetchBaseQueryError,
      };
    }
    return ok({
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      tailor: demoTailor,
    });
  }

  if (action === "refresh-token" && method === "POST") {
    return ok({
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      tailor: demoTailor,
    });
  }

  if (action === "logout" && method === "POST") {
    return ok({ ok: true });
  }

  if (action === "me") {
    if (method === "GET") return ok(demoTailor);
    if (method === "PUT" || method === "PATCH") {
      const patch = (body ?? {}) as Partial<AuthTailor> & {
        aiSummariesEnabled?: boolean;
      };
      const next: AuthTailor = {
        ...demoTailor,
        ...patch,
        privacy:
          typeof patch.aiSummariesEnabled === "boolean"
            ? { aiSummariesEnabled: patch.aiSummariesEnabled }
            : demoTailor.privacy,
      };
      mutators.setTailor(next);
      return ok(next);
    }
  }

  return notFound(`Demo auth: ${method} /${segments.join("/")}`);
}

// ---------------------------------------------------------------------------
// Customer handlers
// ---------------------------------------------------------------------------

function handleCustomers(
  segments: string[],
  method: string,
  body: Record<string, unknown> | undefined,
  query: URLSearchParams
) {
  const id = segments[1];

  if (!id && method === "GET") {
    const search = (query.get("search") ?? "").toLowerCase().trim();
    const page = Number(query.get("page") ?? 1);
    const limit = Number(query.get("limit") ?? 50);
    let items = demoCustomers.slice();
    if (search) {
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          (c.phone ?? "").includes(search)
      );
    }
    return ok(paginate(items, page, limit));
  }

  if (!id && method === "POST") {
    const input = (body ?? {}) as Partial<Customer>;
    const newCustomer: Customer = {
      _id: genId(),
      tailorId: "demo-tailor",
      name: (input.name as string) ?? "Untitled Customer",
      namesByLang: input.namesByLang ?? {},
      phone: input.phone,
      altPhone: input.altPhone,
      address: input.address ?? { city: "Demo City" },
      photoUrl: input.photoUrl,
      notes: input.notes,
      tags: input.tags ?? [],
      measurements: input.measurements ?? {},
      source: "manual",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    mutators.addCustomer(newCustomer);
    return ok(newCustomer);
  }

  if (id) {
    const existing = demoCustomers.find((c) => c._id === id);
    if (!existing) return notFound("Demo: customer not found");

    if (method === "GET") return ok(existing);

    if (method === "PUT" || method === "PATCH") {
      const updated = mutators.updateCustomer(id, (body ?? {}) as Partial<Customer>);
      if (!updated) return notFound("Demo: customer not updated");
      return ok(updated);
    }

    if (method === "DELETE") {
      mutators.updateCustomer(id, {});
      return ok({ ok: true });
    }

    // /customers/:id/measurements/:garmentType
    if (segments[2] === "measurements" && (method === "PUT" || method === "PATCH" || method === "POST")) {
      const garment = segments[3];
      if (!garment) return notFound("Demo: garment type missing");
      const next = {
        ...existing.measurements,
        [garment]: body ?? existing.measurements[garment as keyof typeof existing.measurements],
      };
      const updated = mutators.updateCustomer(id, { measurements: next });
      return ok(updated ?? existing);
    }
  }

  return notFound(`Demo customers: ${method} /${segments.join("/")}`);
}

// ---------------------------------------------------------------------------
// Job handlers
// ---------------------------------------------------------------------------

const NOT_DELIVERED_STATUSES = new Set<JobStatus>([
  "received",
  "cutting",
  "stitching",
  "trial",
  "finishing",
  "ready",
]);

function handleJobs(
  segments: string[],
  method: string,
  body: Record<string, unknown> | undefined,
  query: URLSearchParams
) {
  const id = segments[1];

  if (!id && method === "GET") {
    const from = query.get("from");
    const to = query.get("to");
    const status = query.get("status") as JobStatus | "not_delivered" | null;
    const customerId = query.get("customerId");
    const page = Number(query.get("page") ?? 1);
    const limit = Number(query.get("limit") ?? 50);

    let items = demoJobs.slice();
    if (from) {
      const fromMs = Date.parse(from);
      if (!Number.isNaN(fromMs)) {
        items = items.filter((j) => Date.parse(j.dates.promisedAt) >= fromMs);
      }
    }
    if (to) {
      const toMs = Date.parse(to);
      if (!Number.isNaN(toMs)) {
        items = items.filter((j) => Date.parse(j.dates.promisedAt) <= toMs);
      }
    }
    if (status === "not_delivered") {
      items = items.filter((j) => NOT_DELIVERED_STATUSES.has(j.status));
    } else if (status) {
      items = items.filter((j) => j.status === status);
    }
    if (customerId) {
      items = items.filter((j) => j.customerId === customerId);
    }
    return ok(paginate(items, page, limit));
  }

  if (!id && method === "POST") {
    const input = (body ?? {}) as Partial<JobCard>;
    const promisedAt =
      input.dates?.promisedAt ?? new Date(Date.now() + 5 * 86400000).toISOString();
    const receivedAt = input.dates?.receivedAt ?? nowIso();
    const newJob: JobCard = {
      _id: genId(),
      tailorId: "demo-tailor",
      customerId: (input.customerId as string) ?? "demo-c-asha",
      jobNumber: `J-DEMO-${Math.floor(Math.random() * 9000 + 1000)}`,
      items: input.items ?? [],
      fabric: input.fabric ?? {},
      pricing: input.pricing ?? { currency: "INR" },
      dates: { receivedAt, promisedAt, ...(input.dates ?? {}) },
      status: input.status ?? "received",
      statusHistory: [
        { status: "received", at: receivedAt, note: "Demo created" },
      ],
      priority: input.priority ?? "normal",
      voiceNotes: input.voiceNotes ?? [],
      source: "manual",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    mutators.addJob(newJob);
    return ok(newJob);
  }

  if (id) {
    const existing = demoJobs.find((j) => j._id === id);
    if (!existing) return notFound("Demo: job not found");

    if (method === "GET") return ok(existing);

    // /jobs/:id/status
    if (segments[2] === "status" && (method === "PATCH" || method === "PUT")) {
      const status = (body?.status as JobStatus) ?? existing.status;
      const note = body?.note as string | undefined;
      const at = nowIso();
      const updated = mutators.updateJob(id, {
        status,
        statusHistory: [...existing.statusHistory, { status, at, note }],
        dates:
          status === "delivered"
            ? { ...existing.dates, deliveredAt: at, completedAt: at }
            : existing.dates,
      });
      return ok(updated ?? existing);
    }

    // /jobs/:id/voice
    if (segments[2] === "voice" && method === "POST") {
      const voice = (body ?? {}) as unknown as JobCard["voiceNotes"][number];
      const updated = mutators.updateJob(id, {
        voiceNotes: [...existing.voiceNotes, voice],
      });
      return ok(updated ?? existing);
    }

    if (method === "PUT" || method === "PATCH") {
      const updated = mutators.updateJob(id, (body ?? {}) as Partial<JobCard>);
      return ok(updated ?? existing);
    }

    if (method === "DELETE") {
      mutators.updateJob(id, { status: "cancelled" });
      return ok({ ok: true });
    }
  }

  return notFound(`Demo jobs: ${method} /${segments.join("/")}`);
}

// ---------------------------------------------------------------------------
// Reminder handlers
// ---------------------------------------------------------------------------

function handleReminders(
  segments: string[],
  method: string,
  body: Record<string, unknown> | undefined,
  query: URLSearchParams
) {
  const id = segments[1];

  if (!id && method === "GET") {
    const page = Number(query.get("page") ?? 1);
    const limit = Number(query.get("limit") ?? 50);
    const status = query.get("status");
    let items = demoReminders.slice();
    if (status) items = items.filter((r) => r.status === status);
    items.sort((a, b) => Date.parse(a.remindAt) - Date.parse(b.remindAt));
    return ok(paginate(items, page, limit));
  }

  if (!id && method === "POST") {
    const input = (body ?? {}) as Partial<Reminder>;
    const newReminder: Reminder = {
      _id: genId(),
      tailorId: "demo-tailor",
      jobCardId: input.jobCardId,
      customerId: input.customerId,
      kind: input.kind ?? "custom",
      remindAt: input.remindAt ?? nowIso(),
      channel: input.channel ?? "push",
      message: input.message ?? {},
      status: "pending",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    mutators.addReminder(newReminder);
    return ok(newReminder);
  }

  if (id) {
    const existing = demoReminders.find((r) => r._id === id);
    if (!existing) return notFound("Demo: reminder not found");
    if (method === "GET") return ok(existing);
    if (method === "PUT" || method === "PATCH") {
      return ok({ ...existing, ...(body ?? {}), updatedAt: nowIso() });
    }
  }

  return notFound(`Demo reminders: ${method} /${segments.join("/")}`);
}

// ---------------------------------------------------------------------------
// Insights handlers
// ---------------------------------------------------------------------------

function handleInsights(segments: string[], method: string) {
  const action = segments[1] ?? "";

  if (action === "summary" && method === "GET") {
    return ok(DEMO_INSIGHTS_SUMMARY);
  }

  if (action === "takeaways") {
    if (method === "GET") return ok(DEMO_INSIGHTS_SUMMARY.takeaways);
    if (segments[3] === "dismiss" && method === "POST") {
      return ok({ ok: true });
    }
  }

  if (action === "regenerate" && method === "POST") {
    return ok({ ok: true });
  }

  return notFound(`Demo insights: ${method} /${segments.join("/")}`);
}

// ---------------------------------------------------------------------------
// Top-level mock baseQuery
// ---------------------------------------------------------------------------

type MockResult =
  | { data: unknown }
  | { error: FetchBaseQueryError };

function isStringArg(args: string | FetchArgs): args is string {
  return typeof args === "string";
}

export const mockBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, _api, _extra) => {
  const rawUrl = isStringArg(args) ? args : args.url ?? "";
  const method = (isStringArg(args) ? "GET" : args.method ?? "GET").toUpperCase();
  const rawBody = isStringArg(args) ? undefined : args.body;
  const body =
    rawBody && typeof rawBody === "object"
      ? (rawBody as Record<string, unknown>)
      : undefined;

  const { segments, query } = parseUrl(rawUrl);
  const cleanSegments = withoutSchedulerPrefix(segments);
  const root = cleanSegments[0] ?? "";

  let result: MockResult;
  try {
    if (root === "auth") {
      result = handleAuth(cleanSegments, method, body);
    } else if (root === "customers") {
      result = handleCustomers(cleanSegments, method, body, query);
    } else if (root === "jobs") {
      result = handleJobs(cleanSegments, method, body, query);
    } else if (root === "reminders") {
      result = handleReminders(cleanSegments, method, body, query);
    } else if (root === "insights") {
      result = handleInsights(cleanSegments, method);
    } else {
      result = notFound(`Demo: no handler for ${method} /${cleanSegments.join("/")}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    result = {
      error: {
        status: 500,
        data: { success: false, error: { code: "DEMO_ERROR", message: msg } },
      } as unknown as FetchBaseQueryError,
    };
  }

  return result;
};

// Re-export shape sanity types so the auth handler compile checks `tailor`
// payload structure if it ever changes.
export type { KeyTakeaway };
