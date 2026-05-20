import type {
  AtRiskCustomer,
  BusyDayCell,
  CashflowForecast,
  CustomerSegmentSummary,
  FestivalForecastEntry,
  GarmentMixSlice,
  InsightsSummary,
  KeyTakeaway,
  MonthlyOrdersPoint,
  SalesForecast,
} from "@/types/shared";

function monthKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d;
}

const now = new Date();
const generatedAt = now.toISOString();

const SEASONAL_ORDERS = [22, 18, 24, 28, 34, 30, 26, 28, 38, 56, 64, 42];
const SEASONAL_REVENUE = [18000, 14500, 19500, 23000, 28000, 25000, 21500, 23000, 32000, 48000, 56000, 36000];

export const DEMO_MONTHLY_ORDERS: MonthlyOrdersPoint[] = Array.from({ length: 12 }, (_, i) => {
  const d = addMonths(now, -11 + i);
  return {
    month: monthKey(d),
    orderCount: SEASONAL_ORDERS[i] ?? 0,
    revenue: SEASONAL_REVENUE[i] ?? 0,
  };
});

export const DEMO_GARMENT_MIX: GarmentMixSlice[] = [
  { garmentType: "blouse", count: 84, revenue: 50400, percentage: 32 },
  { garmentType: "kurta", count: 62, revenue: 49600, percentage: 24 },
  { garmentType: "shirt", count: 41, revenue: 20500, percentage: 16 },
  { garmentType: "pant", count: 34, revenue: 23800, percentage: 13 },
  { garmentType: "lehenga", count: 18, revenue: 81000, percentage: 7 },
  { garmentType: "salwar", count: 14, revenue: 8400, percentage: 5 },
  { garmentType: "sherwani", count: 8, revenue: 28000, percentage: 3 },
];

export const DEMO_BUSY_DAYS: BusyDayCell[] = (() => {
  const cells: BusyDayCell[] = [];
  const peakHours = [10, 11, 17, 18, 19, 20];
  for (let weekday = 0; weekday < 7; weekday += 1) {
    for (const hour of peakHours) {
      const weekendBoost = weekday === 0 || weekday === 6 ? 1.6 : 1;
      const peakBoost = hour >= 17 ? 1.4 : 1;
      cells.push({
        weekday: weekday as BusyDayCell["weekday"],
        hour,
        count: Math.round(2 + Math.random() * 4 * weekendBoost * peakBoost),
      });
    }
  }
  return cells;
})();

export const DEMO_FESTIVALS: FestivalForecastEntry[] = [
  {
    festivalKey: "diwali",
    festivalNameLocal: "Diwali",
    date: addMonths(now, 1).toISOString(),
    daysAway: 28,
    predictedMultiplier: 1.8,
    drivingGarmentTypes: ["kurta", "lehenga", "sherwani"],
  },
  {
    festivalKey: "wedding_season",
    festivalNameLocal: "Wedding Season",
    date: addMonths(now, 2).toISOString(),
    daysAway: 58,
    predictedMultiplier: 1.5,
    drivingGarmentTypes: ["lehenga", "sherwani", "blouse"],
  },
  {
    festivalKey: "navratri",
    festivalNameLocal: "Navratri",
    date: addMonths(now, 3).toISOString(),
    daysAway: 88,
    predictedMultiplier: 1.3,
    drivingGarmentTypes: ["kurta", "lehenga"],
  },
];

export const DEMO_CASHFLOW: CashflowForecast = {
  windowDays: 30,
  expectedIncome: 38500,
  pendingJobCount: 22,
  byWeek: [
    { weekStart: new Date(now.getTime() + 0 * 86400000).toISOString(), expected: 9800 },
    { weekStart: new Date(now.getTime() + 7 * 86400000).toISOString(), expected: 12400 },
    { weekStart: new Date(now.getTime() + 14 * 86400000).toISOString(), expected: 8200 },
    { weekStart: new Date(now.getTime() + 21 * 86400000).toISOString(), expected: 8100 },
  ],
};

export const DEMO_CUSTOMER_SEGMENTS: CustomerSegmentSummary = {
  newCount: 18,
  repeatCount: 42,
  vipCount: 6,
  atRiskCount: 9,
};

export const DEMO_AT_RISK: AtRiskCustomer[] = [
  {
    customerId: "demo-c-1",
    name: "Asha Devi",
    lastOrderAt: new Date(now.getTime() - 95 * 86400000).toISOString(),
    daysSinceLastOrder: 95,
    meanIntervalDays: 38,
  },
  {
    customerId: "demo-c-2",
    name: "Vikas Singh",
    lastOrderAt: new Date(now.getTime() - 72 * 86400000).toISOString(),
    daysSinceLastOrder: 72,
    meanIntervalDays: 30,
  },
];

export const DEMO_TOP_GARMENTS: GarmentMixSlice[] = [
  { garmentType: "lehenga", count: 18, revenue: 81000, percentage: 32 },
  { garmentType: "blouse", count: 84, revenue: 50400, percentage: 20 },
  { garmentType: "kurta", count: 62, revenue: 49600, percentage: 19 },
  { garmentType: "sherwani", count: 8, revenue: 28000, percentage: 11 },
  { garmentType: "pant", count: 34, revenue: 23800, percentage: 9 },
];

export const DEMO_FORECAST: SalesForecast = {
  next1Month: {
    month: monthKey(addMonths(now, 1)),
    orders: 58,
    revenue: 52000,
    confidence: "high",
  },
  next3Months: [
    { month: monthKey(addMonths(now, 1)), orders: 58, revenue: 52000, confidence: "high" },
    { month: monthKey(addMonths(now, 2)), orders: 64, revenue: 58000, confidence: "medium" },
    { month: monthKey(addMonths(now, 3)), orders: 44, revenue: 38000, confidence: "medium" },
  ],
  totalNext3MonthsRevenue: 148000,
  trendPctVsLast3Months: 18,
};

export const DEMO_TAKEAWAYS: KeyTakeaway[] = [
  {
    id: "demo-ta-1",
    language: "en",
    iconKey: "calendar",
    category: "festival",
    text: "Diwali is 4 weeks away — start prepping kurta and lehenga orders now.",
    generatedAt,
  },
  {
    id: "demo-ta-2",
    language: "en",
    iconKey: "trend_up",
    category: "trending",
    text: "Blouse work is up 22% vs last quarter — keep extra matching threads.",
    generatedAt,
  },
  {
    id: "demo-ta-3",
    language: "en",
    iconKey: "rupee",
    category: "cashflow",
    text: "₹38,500 expected in the next 30 days. Collect balance on delivery.",
    generatedAt,
  },
];

export const DEMO_INSIGHTS_SUMMARY: InsightsSummary = {
  tailorId: "demo-tailor",
  generatedAt,
  takeaways: DEMO_TAKEAWAYS,
  monthlyOrders: DEMO_MONTHLY_ORDERS,
  garmentMix: DEMO_GARMENT_MIX,
  busyDays: DEMO_BUSY_DAYS,
  festivals: DEMO_FESTIVALS,
  cashflow: DEMO_CASHFLOW,
  customerSegments: DEMO_CUSTOMER_SEGMENTS,
  atRiskCustomers: DEMO_AT_RISK,
  topGarmentsByRevenue: DEMO_TOP_GARMENTS,
  forecast: DEMO_FORECAST,
};

function isEmptyMonthly(arr: MonthlyOrdersPoint[]): boolean {
  if (!arr || arr.length === 0) return true;
  return arr.every((p) => (p.orderCount ?? 0) === 0 && (p.revenue ?? 0) === 0);
}

function isEmptyGarmentMix(arr: GarmentMixSlice[]): boolean {
  if (!arr || arr.length === 0) return true;
  return arr.every((s) => (s.count ?? 0) === 0);
}

function isEmptyBusy(arr: BusyDayCell[]): boolean {
  if (!arr || arr.length === 0) return true;
  return arr.every((c) => (c.count ?? 0) === 0);
}

function isEmptyCashflow(c: CashflowForecast | undefined | null): boolean {
  if (!c) return true;
  return (c.pendingJobCount ?? 0) === 0 && (c.expectedIncome ?? 0) === 0;
}

function isEmptySegments(s: CustomerSegmentSummary | undefined | null): boolean {
  if (!s) return true;
  return (
    (s.newCount ?? 0) === 0 &&
    (s.repeatCount ?? 0) === 0 &&
    (s.vipCount ?? 0) === 0 &&
    (s.atRiskCount ?? 0) === 0
  );
}

function isEmptyForecast(f: SalesForecast | undefined | null): boolean {
  if (!f) return true;
  return (
    (f.next1Month?.orders ?? 0) === 0 && (f.totalNext3MonthsRevenue ?? 0) === 0
  );
}

/**
 * Merge real insights data with rich demo fallback for any sections that are empty.
 * Keeps the user's real labels/numbers when available; only fills holes.
 */
export function withDemoFallback(summary: InsightsSummary): {
  merged: InsightsSummary;
  usedDemoFor: Set<string>;
} {
  const usedDemoFor = new Set<string>();

  const monthlyOrders = isEmptyMonthly(summary.monthlyOrders)
    ? (usedDemoFor.add("monthlyOrders"), DEMO_MONTHLY_ORDERS)
    : summary.monthlyOrders;

  const garmentMix = isEmptyGarmentMix(summary.garmentMix)
    ? (usedDemoFor.add("garmentMix"), DEMO_GARMENT_MIX)
    : summary.garmentMix;

  const busyDays = isEmptyBusy(summary.busyDays)
    ? (usedDemoFor.add("busyDays"), DEMO_BUSY_DAYS)
    : summary.busyDays;

  const festivals =
    !summary.festivals || summary.festivals.length === 0
      ? (usedDemoFor.add("festivals"), DEMO_FESTIVALS)
      : summary.festivals;

  const cashflow = isEmptyCashflow(summary.cashflow)
    ? (usedDemoFor.add("cashflow"), DEMO_CASHFLOW)
    : summary.cashflow;

  const customerSegments = isEmptySegments(summary.customerSegments)
    ? (usedDemoFor.add("customerSegments"), DEMO_CUSTOMER_SEGMENTS)
    : summary.customerSegments;

  const topGarmentsByRevenue = isEmptyGarmentMix(summary.topGarmentsByRevenue)
    ? (usedDemoFor.add("topGarmentsByRevenue"), DEMO_TOP_GARMENTS)
    : summary.topGarmentsByRevenue;

  const forecast = isEmptyForecast(summary.forecast)
    ? (usedDemoFor.add("forecast"), DEMO_FORECAST)
    : summary.forecast;

  const takeaways =
    !summary.takeaways || summary.takeaways.length === 0
      ? (usedDemoFor.add("takeaways"), DEMO_TAKEAWAYS)
      : summary.takeaways;

  return {
    merged: {
      ...summary,
      monthlyOrders,
      garmentMix,
      busyDays,
      festivals,
      cashflow,
      customerSegments,
      topGarmentsByRevenue,
      forecast,
      takeaways,
    },
    usedDemoFor,
  };
}
