/** Dashboard & analytics dummy figures (POC). */

export const DUMMY_MONTHLY_SALES = 312_800;
export const DUMMY_PROJECTED_NEXT_MONTH = 368_500;

/** Dashboard home KPIs (Stitch mockup presentation). */
export const DASHBOARD_KPI = {
  totalSales: 45_200,
  totalSalesTrendPct: 12.5,
  forecastRevenue: 62_000,
  forecastTrendPct: 8.2,
  dueTomorrowCount: 22,
} as const;
export const DUMMY_GST_RATE = 0.05;

export interface DashboardOrderChip {
  jobId: string;
  jobNumber: string;
  customerName: string;
  garmentLabel: string;
  amount: number;
  statusLabel: string;
}

/** Stitch dashboard mockup — four delivery rows. */
export const DUMMY_TODAY_ORDERS: DashboardOrderChip[] = [
  {
    jobId: "demo-job-t-1",
    jobNumber: "#NB-8492",
    customerName: "Amit Kumar",
    garmentLabel: "2x Trousers, 1x Shirt",
    amount: 0,
    statusLabel: "In Progress",
  },
  {
    jobId: "demo-job-t-2",
    jobNumber: "#NB-8491",
    customerName: "Sunita Mehta",
    garmentLabel: "Salwar Suit",
    amount: 0,
    statusLabel: "Ready",
  },
  {
    jobId: "demo-job-t-3",
    jobNumber: "#NB-8490",
    customerName: "Rahul Sharma",
    garmentLabel: "Blazer",
    amount: 0,
    statusLabel: "Delivered",
  },
  {
    jobId: "demo-job-t-4",
    jobNumber: "#NB-8489",
    customerName: "Vikram Joshi",
    garmentLabel: "Custom Sherwani",
    amount: 0,
    statusLabel: "Pending Fabric",
  },
];

export const DUMMY_TOMORROW_ORDERS: DashboardOrderChip[] = [
  {
    jobId: "demo-job-p-1",
    jobNumber: "J-2026-D001",
    customerName: "Asha Devi",
    garmentLabel: "Blouse",
    amount: 1200,
    statusLabel: "Stitching",
  },
  {
    jobId: "demo-job-p-2",
    jobNumber: "J-2026-D002",
    customerName: "Meera Sharma",
    garmentLabel: "Lehenga",
    amount: 4500,
    statusLabel: "Cutting",
  },
  {
    jobId: "demo-job-p-4",
    jobNumber: "J-2026-D004",
    customerName: "Sunita Agarwal",
    garmentLabel: "Salwar",
    amount: 700,
    statusLabel: "Finishing",
  },
  {
    jobId: "demo-job-p-9",
    jobNumber: "J-2026-D009",
    customerName: "Kavita Reddy",
    garmentLabel: "Lehenga",
    amount: 6200,
    statusLabel: "Cutting",
  },
  {
    jobId: "demo-job-p-12",
    jobNumber: "J-2026-D012",
    customerName: "Harish Pillai",
    garmentLabel: "Shirt",
    amount: 2400,
    statusLabel: "Ready",
  },
];

export interface AnalyticsKpiDelta {
  value: string;
  positive: boolean;
}

export interface AnalyticsRepeatCustomer {
  initials: string;
  name: string;
  ordersThisMonth: number;
  spend: number;
  trendLabel: string;
  trendPositive: boolean | null;
  avatarTone: "primary" | "tertiary" | "muted";
}

export const DUMMY_ANALYTICS = {
  monthlyRevenue: [198000, 215000, 232000, 268000, 289500, 312800],
  monthlyExpenses: [118000, 125000, 134000, 148000, 162000, 174000],
  monthLabels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
  topGarments: [
    { name: "Blouse", pct: 28 },
    { name: "Kurta", pct: 22 },
    { name: "Lehenga", pct: 16 },
    { name: "Shirt", pct: 14 },
    { name: "Sherwani", pct: 10 },
    { name: "Salwar", pct: 10 },
  ],
  repeatCustomers: 72,
  newCustomers: 31,
  avgOrderValue: 3150,
  pendingBalance: 58_400,
  totalRevenue: 312_800,
  efficiencyJobsPerDay: 14.5,
  kpiDeltas: {
    totalRevenue: { value: "+12%", positive: true },
    avgOrderValue: { value: "+5%", positive: true },
    repeatCustomers: { value: "+2%", positive: true },
    efficiency: { value: "-1.2", positive: false },
  } satisfies Record<string, AnalyticsKpiDelta>,
  topRepeatCustomers: [
    {
      initials: "AS",
      name: "Aarav Sharma",
      ordersThisMonth: 12,
      spend: 18_500,
      trendLabel: "Top 1%",
      trendPositive: true,
      avatarTone: "primary",
    },
    {
      initials: "NP",
      name: "Neha Patel",
      ordersThisMonth: 8,
      spend: 12_200,
      trendLabel: "Top 5%",
      trendPositive: true,
      avatarTone: "tertiary",
    },
    {
      initials: "VK",
      name: "Vikram Kumar",
      ordersThisMonth: 5,
      spend: 8_900,
      trendLabel: "Steady",
      trendPositive: null,
      avatarTone: "muted",
    },
  ] satisfies AnalyticsRepeatCustomer[],
  insights: {
    peakHours: "4:00 PM – 7:00 PM",
    peakHoursNote:
      "35% of walk-ins occur during this window. Consider extra staff.",
    topGarment: "Designer Blouse",
    topGarmentNote:
      "Highest profit margin (65%) and fastest growing category.",
  },
};
