// Demo mode: offline fixtures via mock API — no backend required.

/** True when NEXT_PUBLIC_DEMO_MODE is set to "true". */
export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/** In-memory API (customers, jobs, insights, today queue). */
export const USE_OFFLINE_MOCK_API = IS_DEMO_MODE;

/**
 * Start signed in as demo tailor (instant POC). Set NEXT_PUBLIC_DEMO_SKIP_LOGIN=false
 * to exercise login with POC_PHONE_LOCAL_DIGITS + POC_OTP from demoCredentials.ts.
 */
export const DEMO_SKIP_LOGIN =
  IS_DEMO_MODE && process.env.NEXT_PUBLIC_DEMO_SKIP_LOGIN !== "false";
