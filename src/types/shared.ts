// Local mirrors of @naapbook/shared contracts. We don't import from the
// workspace package because the mobile app is built independently (and Metro
// has its own resolution rules). Keep these in sync with backend/shared.

export type ID = string;
export type ISODateString = string;
export type SupportedLanguage = "en" | "hi" | "mr" | "ta" | "kn";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "hi", "mr", "ta", "kn"];

export const LANGUAGE_LABELS: Record<SupportedLanguage, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  hi: { native: "हिन्दी", english: "Hindi" },
  mr: { native: "मराठी", english: "Marathi" },
  ta: { native: "தமிழ்", english: "Tamil" },
  kn: { native: "ಕನ್ನಡ", english: "Kannada" },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export type ThemeName = "minimal_white" | "vibrant" | "green" | "dark";

export const THEME_NAMES: ThemeName[] = ["minimal_white", "vibrant", "green", "dark"];

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// -------- Auth --------
export interface AuthTailor {
  id: ID;
  phone: string;
  name: string;
  shopName: string;
  preferredLanguage: SupportedLanguage | string;
  preferredTheme: ThemeName | string;
  isOnboarded: boolean;
  privacy: { aiSummariesEnabled: boolean };
}

export interface TailorProfile extends AuthTailor {
  role?: "tailor" | "admin";
  expoPushToken?: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface UpdateMePayload {
  name?: string;
  shopName?: string;
  preferredLanguage?: string;
  preferredTheme?: string;
  aiSummariesEnabled?: boolean;
  isOnboarded?: boolean;
  expoPushToken?: string;
}

// -------- Garment --------
export type GarmentType =
  | "kurta"
  | "blouse"
  | "shirt"
  | "pant"
  | "salwar"
  | "sherwani"
  | "suit"
  | "lehenga"
  | "saree_fall"
  | "dupatta"
  | "petticoat"
  | "kameez"
  | "churidar"
  | "nightgown"
  | "anarkali"
  | "sharara"
  | "palazzo"
  | "blazer"
  | "waistcoat"
  | "skirt"
  | "gown"
  | "frock"
  | "choli"
  | "saree"
  | "custom";

export const GARMENT_TYPES: GarmentType[] = [
  "kurta",
  "blouse",
  "shirt",
  "pant",
  "salwar",
  "sherwani",
  "suit",
  "lehenga",
  "saree_fall",
  "dupatta",
  "petticoat",
  "kameez",
  "churidar",
  "nightgown",
  "anarkali",
  "sharara",
  "palazzo",
  "blazer",
  "waistcoat",
  "skirt",
  "gown",
  "frock",
  "choli",
  "saree",
  "custom",
];

// -------- Customer --------
export type MeasurementUnit = "inch" | "cm";

export interface MeasurementSet {
  _id?: ID;
  garmentType: GarmentType;
  garmentLabel?: string;
  unit: MeasurementUnit;
  fields: Record<string, number>;
  /** Free-text or fraction display (e.g. 1/4, as per sample). */
  textFields?: Record<string, string>;
  takenAt: ISODateString;
  takenBy?: "tailor" | "helper";
  voiceNoteUrl?: string;
  notes?: string;
}

export interface CustomerAddress {
  text?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
}

export interface Customer {
  _id: ID;
  tailorId: ID;
  name: string;
  namesByLang?: Partial<Record<SupportedLanguage, string>>;
  phone?: string;
  altPhone?: string;
  address?: CustomerAddress;
  photoUrl?: string;
  notes?: string;
  tags: string[];
  measurements: Partial<Record<GarmentType, MeasurementSet>>;
  source: "manual" | "voice" | "imported_ocr" | "imported_csv" | "imported_voice";
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateCustomerInput {
  name: string;
  namesByLang?: Partial<Record<SupportedLanguage, string>>;
  phone?: string;
  altPhone?: string;
  address?: CustomerAddress;
  photoUrl?: string;
  notes?: string;
  tags?: string[];
  measurements?: Partial<Record<GarmentType, MeasurementSet>>;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

// -------- Job Card --------
export type JobStatus =
  | "received"
  | "cutting"
  | "stitching"
  | "trial"
  | "finishing"
  | "ready"
  | "delivered"
  | "cancelled";

export const JOB_STATUS_FLOW: Record<JobStatus, JobStatus[]> = {
  received: ["cutting", "cancelled"],
  cutting: ["stitching", "cancelled"],
  stitching: ["trial", "finishing", "cancelled"],
  trial: ["finishing", "stitching", "cancelled"],
  finishing: ["ready", "cancelled"],
  ready: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export type JobPriority = "normal" | "urgent" | "festival";

export interface JobItem {
  garmentType: GarmentType;
  garmentLabel?: string;
  quantity: number;
  measurementSnapshot?: MeasurementSet;
  customMeasurements?: Record<string, number>;
  notes?: string;
}

export interface JobFabric {
  type?: string;
  color?: string;
  notes?: string;
  photoUrls?: string[];
}

export interface JobPricing {
  quoted?: number;
  advance?: number;
  balance?: number;
  currency?: "INR";
}

export interface JobDates {
  receivedAt: ISODateString;
  trialAt?: ISODateString;
  promisedAt: ISODateString;
  completedAt?: ISODateString;
  deliveredAt?: ISODateString;
}

export interface JobStatusHistoryEntry {
  status: JobStatus;
  at: ISODateString;
  note?: string;
}

export interface VoiceNote {
  url: string;
  durationMs: number;
  at: ISODateString;
  transcript?: string;
  language?: string;
}

export interface JobCard {
  _id: ID;
  tailorId: ID;
  customerId: ID;
  jobNumber: string;
  items: JobItem[];
  fabric: JobFabric;
  pricing: JobPricing;
  dates: JobDates;
  status: JobStatus;
  statusHistory: JobStatusHistoryEntry[];
  priority: JobPriority;
  voiceNotes: VoiceNote[];
  source: "manual" | "voice" | "imported_ocr" | "imported_csv" | "imported_voice";
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateJobCardInput {
  customerId: ID;
  items: JobItem[];
  fabric?: JobFabric;
  pricing?: JobPricing;
  dates: Partial<JobDates> & { promisedAt: ISODateString };
  priority?: JobPriority;
  voiceNotes?: VoiceNote[];
}

export type UpdateJobCardInput = Partial<CreateJobCardInput>;

export interface UpdateJobStatusInput {
  status: JobStatus;
  note?: string;
}

// -------- Reminder --------
export type ReminderKind =
  | "delivery_due"
  | "trial"
  | "pickup"
  | "advance_due"
  | "custom";

export type ReminderChannel = "push" | "wa_share";

export type ReminderStatus =
  | "pending"
  | "sent"
  | "snoozed"
  | "dismissed"
  | "failed";

export interface ReminderMessage {
  hi?: string;
  en?: string;
  mr?: string;
  ta?: string;
  kn?: string;
}

export interface Reminder {
  _id: ID;
  tailorId: ID;
  jobCardId?: ID;
  customerId?: ID;
  kind: ReminderKind;
  remindAt: ISODateString;
  channel: ReminderChannel;
  message: ReminderMessage;
  status: ReminderStatus;
  snoozedUntil?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateReminderInput {
  jobCardId?: ID;
  customerId?: ID;
  kind: ReminderKind;
  remindAt: ISODateString;
  channel?: ReminderChannel;
  message?: ReminderMessage;
}

// -------- Insights --------
export interface MonthlyOrdersPoint {
  month: string;
  orderCount: number;
  revenue: number;
}

export interface GarmentMixSlice {
  garmentType: GarmentType;
  count: number;
  revenue: number;
  percentage: number;
}

export interface BusyDayCell {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  hour: number;
  count: number;
}

export interface FestivalForecastEntry {
  festivalKey: string;
  festivalNameLocal: string;
  date: ISODateString;
  daysAway: number;
  predictedMultiplier: number;
  drivingGarmentTypes: GarmentType[];
}

export interface CashflowForecast {
  windowDays: number;
  expectedIncome: number;
  pendingJobCount: number;
  byWeek: { weekStart: ISODateString; expected: number }[];
}

export type ForecastConfidence = "low" | "medium" | "high";

export interface SalesForecastPoint {
  month: string;
  orders: number;
  revenue: number;
  confidence: ForecastConfidence;
}

export interface SalesForecast {
  next1Month: SalesForecastPoint;
  next3Months: SalesForecastPoint[];
  totalNext3MonthsRevenue: number;
  trendPctVsLast3Months: number;
}

export interface CustomerSegmentSummary {
  newCount: number;
  repeatCount: number;
  vipCount: number;
  atRiskCount: number;
}

export interface AtRiskCustomer {
  customerId: ID;
  name: string;
  lastOrderAt: ISODateString;
  daysSinceLastOrder: number;
  meanIntervalDays: number;
}

export interface KeyTakeaway {
  id: string;
  language: string;
  iconKey: string;
  text: string;
  category:
    | "festival"
    | "at_risk"
    | "cashflow"
    | "trending"
    | "workload"
    | "pricing"
    | "other";
  dismissed?: boolean;
  generatedAt: ISODateString;
}

export interface InsightsSummary {
  tailorId: ID;
  generatedAt: ISODateString;
  takeaways: KeyTakeaway[];
  monthlyOrders: MonthlyOrdersPoint[];
  garmentMix: GarmentMixSlice[];
  busyDays: BusyDayCell[];
  festivals: FestivalForecastEntry[];
  cashflow: CashflowForecast;
  customerSegments: CustomerSegmentSummary;
  atRiskCustomers: AtRiskCustomer[];
  topGarmentsByRevenue: GarmentMixSlice[];
  forecast: SalesForecast;
}
