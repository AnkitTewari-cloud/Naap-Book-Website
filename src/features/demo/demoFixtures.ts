import type {
  AuthTailor,
  Customer,
  GarmentType,
  JobCard,
  MeasurementSet,
  Reminder,
} from "@/types/shared";
import {
  EXTRA_CUSTOMER_SEEDS,
  EXTRA_DEMO_JOBS,
} from "@/features/demo/demoDataExtra";
import {
  DEMO_DONE_JOBS,
  DEMO_PENDING_JOBS,
} from "@/features/scheduler/data/demoJobs";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const TAILOR_ID = "demo-tailor";
const now = new Date();
const todayIso = now.toISOString();

function isoDaysFromNow(days: number, hour = 12): string {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function measurement(
  garmentType: GarmentType,
  fields: Record<string, number>
): MeasurementSet {
  return {
    garmentType,
    unit: "inch",
    fields,
    takenAt: todayIso,
    takenBy: "tailor",
  };
}

// ---------------------------------------------------------------------------
// Demo tailor
// ---------------------------------------------------------------------------

export const DEMO_TAILOR: AuthTailor = {
  id: TAILOR_ID,
  phone: "1234567890",
  name: "Ramesh Kumar",
  shopName: "Ramesh Tailoring Works",
  preferredLanguage: "en",
  preferredTheme: "minimal_white",
  isOnboarded: true,
  privacy: { aiSummariesEnabled: true },
};

// ---------------------------------------------------------------------------
// Demo customers (10 base + 6 from demoDataExtra.ts = 16)
// ---------------------------------------------------------------------------

interface CustomerSeed {
  id: string;
  name: string;
  phone: string;
  namesByLang: Required<Customer>["namesByLang"];
  measurements: Partial<Record<GarmentType, MeasurementSet>>;
}

const CUSTOMER_SEEDS: CustomerSeed[] = [
  {
    id: "demo-c-asha",
    name: "Asha Devi",
    phone: "9876500001",
    namesByLang: {
      en: "Asha Devi",
      hi: "आशा देवी",
      mr: "आशा देवी",
      ta: "ஆஷா தேவி",
      kn: "ಆಶಾ ದೇವಿ",
    },
    measurements: {
      blouse: measurement("blouse", {
        bust: 36,
        waist: 32,
        shoulder: 13,
        sleeve: 6,
        length: 14,
      }),
      kurta: measurement("kurta", {
        chest: 38,
        waist: 34,
        hip: 40,
        shoulder: 14,
        sleeve: 22,
        length: 42,
        neck: 16,
      }),
    },
  },
  {
    id: "demo-c-meera",
    name: "Meera Sharma",
    phone: "9876500002",
    namesByLang: {
      en: "Meera Sharma",
      hi: "मीरा शर्मा",
      mr: "मीरा शर्मा",
      ta: "மீரா சர்மா",
      kn: "ಮೀರಾ ಶರ್ಮಾ",
    },
    measurements: {
      lehenga: measurement("lehenga", {
        waist: 30,
        hip: 40,
        length: 40,
        flare: 90,
      }),
      blouse: measurement("blouse", {
        bust: 38,
        waist: 34,
        shoulder: 14,
        armhole: 17,
        sleeve: 6,
        length: 15,
      }),
    },
  },
  {
    id: "demo-c-rajesh",
    name: "Rajesh Kumar",
    phone: "9876500003",
    namesByLang: {
      en: "Rajesh Kumar",
      hi: "राजेश कुमार",
      mr: "राजेश कुमार",
      ta: "ராஜேஷ் குமார்",
      kn: "ರಾಜೇಶ್ ಕುಮಾರ್",
    },
    measurements: {
      shirt: measurement("shirt", {
        chest: 42,
        waist: 38,
        shoulder: 17,
        sleeve: 24,
        length: 28,
        neck: 16,
        collar: 16,
      }),
    },
  },
  {
    id: "demo-c-sunita",
    name: "Sunita Agarwal",
    phone: "9876500004",
    namesByLang: {
      en: "Sunita Agarwal",
      hi: "सुनीता अग्रवाल",
      mr: "सुनीता अगरवाल",
      ta: "சுனிதா அகர்வால்",
      kn: "ಸುನೀತಾ ಅಗರ್ವಾಲ್",
    },
    measurements: {
      salwar: measurement("salwar", {
        waist: 36,
        hip: 42,
        length: 38,
        bottom: 12,
      }),
    },
  },
  {
    id: "demo-c-lakshmi",
    name: "Lakshmi Patel",
    phone: "9876500005",
    namesByLang: {
      en: "Lakshmi Patel",
      hi: "लक्ष्मी पटेल",
      mr: "लक्ष्मी पटेल",
      ta: "லட்சுமி படேல்",
      kn: "ಲಕ್ಷ್ಮಿ ಪಟೇಲ್",
    },
    measurements: {
      blouse: measurement("blouse", {
        bust: 38,
        waist: 34,
        shoulder: 14,
        sleeve: 5,
        length: 15,
      }),
    },
  },
  {
    id: "demo-c-vikas",
    name: "Vikas Singh",
    phone: "9876500006",
    namesByLang: {
      en: "Vikas Singh",
      hi: "विकास सिंह",
      mr: "विकास सिंह",
      ta: "விகாஸ் சிங்",
      kn: "ವಿಕಾಸ್ ಸಿಂಗ್",
    },
    measurements: {
      pant: measurement("pant", {
        waist: 34,
        hip: 40,
        length: 40,
        thigh: 22,
        knee: 16,
        bottom: 14,
      }),
    },
  },
  {
    id: "demo-c-amit",
    name: "Amit Jain",
    phone: "9876500007",
    namesByLang: {
      en: "Amit Jain",
      hi: "अमित जैन",
      mr: "अमित जैन",
      ta: "அமித் ஜெயின்",
      kn: "ಅಮಿತ್ ಜೈನ್",
    },
    measurements: {
      sherwani: measurement("sherwani", {
        chest: 42,
        waist: 38,
        hip: 42,
        shoulder: 17,
        sleeve: 25,
        length: 44,
      }),
    },
  },
  {
    id: "demo-c-priya",
    name: "Priya Iyer",
    phone: "9876500008",
    namesByLang: {
      en: "Priya Iyer",
      hi: "प्रिया अय्यर",
      mr: "प्रिया अय्यर",
      ta: "பிரியா ஐயர்",
      kn: "ಪ್ರಿಯಾ ಅಯ್ಯರ್",
    },
    measurements: {
      kurta: measurement("kurta", {
        chest: 36,
        waist: 32,
        hip: 38,
        shoulder: 13,
        sleeve: 21,
        length: 40,
        neck: 15,
      }),
    },
  },
  {
    id: "demo-c-geeta",
    name: "Geeta Verma",
    phone: "9876500009",
    namesByLang: {
      en: "Geeta Verma",
      hi: "गीता वर्मा",
      mr: "गीता वर्मा",
      ta: "கீதா வர்மா",
      kn: "ಗೀತಾ ವರ್ಮಾ",
    },
    measurements: {
      blouse: measurement("blouse", {
        bust: 34,
        waist: 30,
        shoulder: 13,
        armhole: 15,
        sleeve: 5,
        length: 14,
      }),
    },
  },
  {
    id: "demo-c-ramesh",
    name: "Ramesh Yadav",
    phone: "9876500010",
    namesByLang: {
      en: "Ramesh Yadav",
      hi: "रमेश यादव",
      mr: "रमेश यादव",
      ta: "ரமேஷ் யாதவ்",
      kn: "ರಮೇಶ್ ಯಾದವ್",
    },
    measurements: {
      shirt: measurement("shirt", {
        chest: 44,
        waist: 40,
        shoulder: 18,
        sleeve: 25,
        length: 29,
        neck: 17,
        collar: 17,
      }),
    },
  },
];

function customerFromSeed(
  seed: CustomerSeed | (typeof EXTRA_CUSTOMER_SEEDS)[number]
): Customer {
  return {
    _id: seed.id,
    tailorId: TAILOR_ID,
    name: seed.name,
    namesByLang: seed.namesByLang,
    phone: seed.phone,
    tags: "tags" in seed && seed.tags ? [...seed.tags] : [],
    measurements: seed.measurements,
    address: { city: "Demo City" },
    source: "manual",
    createdAt: todayIso,
    updatedAt: todayIso,
  };
}

// ---------------------------------------------------------------------------
// Demo jobs — scheduler fixtures + 4 today@noon deliveries + demoDataExtra (10)
// ---------------------------------------------------------------------------

const EXISTING_JOBS: JobCard[] = [
  ...DEMO_PENDING_JOBS.map((e) => e.job),
  ...DEMO_DONE_JOBS.map((e) => e.job),
];

const TODAY_NOON = isoDaysFromNow(0, 12);
const YESTERDAY = isoDaysFromNow(-1, 12);

const TODAY_DELIVERIES: JobCard[] = [
  {
    _id: "demo-job-t-1",
    tailorId: TAILOR_ID,
    customerId: "demo-c-asha",
    jobNumber: "J-2026-T001",
    items: [
      {
        garmentType: "blouse",
        quantity: 1,
        customMeasurements: {
          bust: 36,
          waist: 32,
          shoulder: 13,
          sleeve: 6,
          length: 14,
        },
        notes: "Pickup at noon",
      },
    ],
    fabric: { type: "Cotton Silk", color: "Mustard" },
    pricing: { quoted: 950, advance: 500, balance: 450, currency: "INR" },
    dates: {
      receivedAt: isoDaysFromNow(-4, 10),
      promisedAt: TODAY_NOON,
    },
    status: "ready",
    statusHistory: [
      { status: "received", at: isoDaysFromNow(-4, 10) },
      { status: "stitching", at: isoDaysFromNow(-2, 10) },
      { status: "ready", at: YESTERDAY },
    ],
    priority: "normal",
    voiceNotes: [],
    source: "manual",
    createdAt: isoDaysFromNow(-4, 10),
    updatedAt: YESTERDAY,
  },
  {
    _id: "demo-job-t-2",
    tailorId: TAILOR_ID,
    customerId: "demo-c-vikas",
    jobNumber: "J-2026-T002",
    items: [
      {
        garmentType: "pant",
        quantity: 1,
        customMeasurements: {
          waist: 34,
          hip: 40,
          length: 40,
          thigh: 22,
          knee: 16,
          bottom: 14,
        },
      },
    ],
    fabric: { type: "Polyester", color: "Black" },
    pricing: { quoted: 700, advance: 200, balance: 500, currency: "INR" },
    dates: {
      receivedAt: isoDaysFromNow(-3, 11),
      promisedAt: TODAY_NOON,
    },
    status: "ready",
    statusHistory: [
      { status: "received", at: isoDaysFromNow(-3, 11) },
      { status: "stitching", at: isoDaysFromNow(-2, 9) },
      { status: "ready", at: YESTERDAY },
    ],
    priority: "normal",
    voiceNotes: [],
    source: "manual",
    createdAt: isoDaysFromNow(-3, 11),
    updatedAt: YESTERDAY,
  },
  {
    _id: "demo-job-t-3",
    tailorId: TAILOR_ID,
    customerId: "demo-c-priya",
    jobNumber: "J-2026-T003",
    items: [
      {
        garmentType: "kurta",
        quantity: 1,
        customMeasurements: {
          chest: 36,
          waist: 32,
          hip: 38,
          shoulder: 13,
          sleeve: 21,
          length: 40,
          neck: 15,
        },
        notes: "Side slits",
      },
    ],
    fabric: { type: "Linen", color: "Sage" },
    pricing: { quoted: 850, advance: 300, balance: 550, currency: "INR" },
    dates: {
      receivedAt: isoDaysFromNow(-5, 11),
      promisedAt: TODAY_NOON,
    },
    status: "finishing",
    statusHistory: [
      { status: "received", at: isoDaysFromNow(-5, 11) },
      { status: "stitching", at: isoDaysFromNow(-3, 10) },
      { status: "finishing", at: isoDaysFromNow(-1, 9) },
    ],
    priority: "urgent",
    voiceNotes: [],
    source: "manual",
    createdAt: isoDaysFromNow(-5, 11),
    updatedAt: isoDaysFromNow(-1, 9),
  },
  {
    _id: "demo-job-t-4",
    tailorId: TAILOR_ID,
    customerId: "demo-c-geeta",
    jobNumber: "J-2026-T004",
    items: [
      {
        garmentType: "blouse",
        quantity: 1,
        customMeasurements: {
          bust: 34,
          waist: 30,
          shoulder: 13,
          armhole: 15,
          sleeve: 5,
          length: 14,
        },
        notes: "Puff sleeves",
      },
    ],
    fabric: { type: "Silk", color: "Wine" },
    pricing: { quoted: 1300, advance: 400, balance: 900, currency: "INR" },
    dates: {
      receivedAt: isoDaysFromNow(-6, 11),
      promisedAt: TODAY_NOON,
    },
    status: "ready",
    statusHistory: [
      { status: "received", at: isoDaysFromNow(-6, 11) },
      { status: "stitching", at: isoDaysFromNow(-4, 10) },
      { status: "ready", at: YESTERDAY },
    ],
    priority: "normal",
    voiceNotes: [],
    source: "manual",
    createdAt: isoDaysFromNow(-6, 11),
    updatedAt: YESTERDAY,
  },
];

// ---------------------------------------------------------------------------
// Demo reminders
// ---------------------------------------------------------------------------

function buildReminders(): Reminder[] {
  return [
    {
      _id: "demo-r-1",
      tailorId: TAILOR_ID,
      jobCardId: "demo-job-t-4",
      customerId: "demo-c-geeta",
      kind: "delivery_due",
      remindAt: isoDaysFromNow(0, 11),
      channel: "wa_share",
      message: {
        en: "Meera's blouse is ready for pickup today at noon.",
        hi: "मीरा का ब्लाउज़ आज दोपहर तैयार है।",
      },
      status: "pending",
      createdAt: isoDaysFromNow(-1),
      updatedAt: todayIso,
    },
    {
      _id: "demo-r-2",
      tailorId: TAILOR_ID,
      jobCardId: "demo-job-p-1",
      customerId: "demo-c-asha",
      kind: "trial",
      remindAt: isoDaysFromNow(1, 16),
      channel: "push",
      message: {
        en: "Asha Devi trial fitting tomorrow at 4 PM.",
        hi: "आशा देवी का कल शाम 4 बजे ट्रायल है।",
      },
      status: "pending",
      createdAt: isoDaysFromNow(-1),
      updatedAt: todayIso,
    },
    {
      _id: "demo-r-3",
      tailorId: TAILOR_ID,
      jobCardId: "demo-job-p-6",
      customerId: "demo-c-vikas",
      kind: "delivery_due",
      remindAt: isoDaysFromNow(2, 12),
      channel: "wa_share",
      message: {
        en: "Vikas Singh's pant delivery in 2 days.",
        hi: "विकास सिंह की पैंट डिलीवरी 2 दिनों में।",
      },
      status: "pending",
      createdAt: isoDaysFromNow(-2),
      updatedAt: todayIso,
    },
    {
      _id: "demo-r-4",
      tailorId: TAILOR_ID,
      jobCardId: "demo-job-d-1",
      customerId: "demo-c-geeta",
      kind: "advance_due",
      remindAt: isoDaysFromNow(-1, 15),
      channel: "wa_share",
      message: {
        en: "Geeta Verma — advance payment was due yesterday.",
        hi: "गीता वर्मा — कल अग्रिम भुगतान बाकी था।",
      },
      status: "pending",
      createdAt: isoDaysFromNow(-3),
      updatedAt: todayIso,
    },
    {
      _id: "demo-r-5",
      tailorId: TAILOR_ID,
      jobCardId: "demo-job-p-14",
      customerId: "demo-c-omkar",
      kind: "trial",
      remindAt: isoDaysFromNow(3, 11),
      channel: "push",
      message: {
        en: "Omkar Deshpande sherwani trial in 3 days.",
        hi: "ओंकार देशपांडे शेरवानी ट्रायल 3 दिन में।",
      },
      status: "pending",
      createdAt: todayIso,
      updatedAt: todayIso,
    },
    {
      _id: "demo-r-6",
      tailorId: TAILOR_ID,
      jobCardId: "demo-job-p-9",
      customerId: "demo-c-kavita",
      kind: "delivery_due",
      remindAt: isoDaysFromNow(5, 10),
      channel: "wa_share",
      message: {
        en: "Kavita Reddy lehenga delivery in 5 days.",
        hi: "कविता रेड्डी लहंगा 5 दिन में।",
      },
      status: "pending",
      createdAt: todayIso,
      updatedAt: todayIso,
    },
  ];
}

// ---------------------------------------------------------------------------
// Module-level mutable state — the mock baseQuery mutates these on
// POST/PATCH/DELETE so the UI sees its changes for the rest of the session.
// ---------------------------------------------------------------------------

export let demoCustomers: Customer[] = [
  ...CUSTOMER_SEEDS,
  ...EXTRA_CUSTOMER_SEEDS,
].map(customerFromSeed);
/** Scheduler fixtures + 4 today deliveries + 10 jobs from demoDataExtra.ts */
export let demoJobs: JobCard[] = [
  ...EXISTING_JOBS,
  ...TODAY_DELIVERIES,
  ...EXTRA_DEMO_JOBS,
];
export let demoReminders: Reminder[] = buildReminders();
export let demoTailor: AuthTailor = { ...DEMO_TAILOR };

// Exported mutators keep the `let` bindings live and allow the mock query to
// replace whole arrays (e.g. for filter/sort operations) when needed.
export const mutators = {
  setTailor(next: AuthTailor) {
    demoTailor = next;
  },
  addCustomer(c: Customer) {
    demoCustomers = [c, ...demoCustomers];
  },
  updateCustomer(id: string, patch: Partial<Customer>): Customer | undefined {
    let updated: Customer | undefined;
    demoCustomers = demoCustomers.map((c) => {
      if (c._id !== id) return c;
      updated = {
        ...c,
        ...patch,
        measurements: { ...c.measurements, ...(patch.measurements ?? {}) },
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
    return updated;
  },
  addJob(j: JobCard) {
    demoJobs = [j, ...demoJobs];
  },
  updateJob(id: string, patch: Partial<JobCard>): JobCard | undefined {
    let updated: JobCard | undefined;
    demoJobs = demoJobs.map((j) => {
      if (j._id !== id) return j;
      updated = {
        ...j,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
    return updated;
  },
  addReminder(r: Reminder) {
    demoReminders = [r, ...demoReminders];
  },
};
