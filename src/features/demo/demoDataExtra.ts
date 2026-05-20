/**
 * Additional demo records merged in demoFixtures.ts (keeps main file smaller).
 */
import type { Customer, GarmentType, JobCard, MeasurementSet } from "@/types/shared";

const TAILOR_ID = "demo-tailor";
const now = new Date();
const todayIso = now.toISOString();

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

export interface ExtraCustomerSeed {
  id: string;
  name: string;
  phone: string;
  namesByLang: Required<Customer>["namesByLang"];
  measurements: Partial<Record<GarmentType, MeasurementSet>>;
  tags?: string[];
}

export const EXTRA_CUSTOMER_SEEDS: ExtraCustomerSeed[] = [
  {
    id: "demo-c-kavita",
    name: "Kavita Reddy",
    phone: "9876500011",
    namesByLang: {
      en: "Kavita Reddy",
      hi: "कविता रेड्डी",
      mr: "कविता रेड्डी",
      ta: "கவிதா ரெడ்டி",
      kn: "ಕವಿತಾ ರೆಡ್ಡಿ",
    },
    tags: ["VIP", "Wedding"],
    measurements: {
      lehenga: measurement("lehenga", {
        waist: 28,
        hip: 38,
        length: 42,
        flare: 100,
      }),
    },
  },
  {
    id: "demo-c-arjun",
    name: "Arjun Menon",
    phone: "9876500012",
    namesByLang: {
      en: "Arjun Menon",
      hi: "अर्जुन मेनन",
      mr: "अर्जुन मेनन",
      ta: "அர்ஜுன் மேனன்",
      kn: "ಅರ್ಜುನ್ ಮೆನನ್",
    },
    tags: ["Corporate"],
    measurements: {
      shirt: measurement("shirt", {
        chest: 40,
        waist: 36,
        shoulder: 16,
        sleeve: 23,
        length: 27,
        neck: 15,
        collar: 15,
      }),
      pant: measurement("pant", {
        waist: 32,
        hip: 38,
        length: 39,
        thigh: 20,
        knee: 15,
        bottom: 13,
      }),
    },
  },
  {
    id: "demo-c-divya",
    name: "Divya Nambiar",
    phone: "9876500013",
    namesByLang: {
      en: "Divya Nambiar",
      hi: "दिव्या नंबियार",
      mr: "दिव्या नंबियार",
      ta: "திவ்யா நம்பியார்",
      kn: "ದಿವ್ಯಾ ನಂಬಿಯಾರ್",
    },
    measurements: {
      blouse: measurement("blouse", {
        bust: 35,
        waist: 31,
        shoulder: 12,
        sleeve: 5,
        length: 13,
      }),
      kurta: measurement("kurta", {
        chest: 34,
        waist: 30,
        hip: 36,
        shoulder: 12,
        sleeve: 20,
        length: 38,
        neck: 14,
      }),
    },
  },
  {
    id: "demo-c-harish",
    name: "Harish Pillai",
    phone: "9876500014",
    namesByLang: {
      en: "Harish Pillai",
      hi: "हरीश पिल्लई",
      mr: "हरीश पिल्लई",
      ta: "ஹரிஷ் பிள்ளை",
      kn: "ಹರಿಶ್ ಪಿಳ್ಳೈ",
    },
    tags: ["Bulk"],
    measurements: {
      shirt: measurement("shirt", {
        chest: 38,
        waist: 34,
        shoulder: 15,
        sleeve: 22,
        length: 26,
        neck: 15,
        collar: 15,
      }),
    },
  },
  {
    id: "demo-c-nandini",
    name: "Nandini Rao",
    phone: "9876500015",
    namesByLang: {
      en: "Nandini Rao",
      hi: "नंदिनी राव",
      mr: "नंदिनी राव",
      ta: "நந்தினி ராவ்",
      kn: "ನಂದಿನಿ ರಾವ್",
    },
    measurements: {
      salwar: measurement("salwar", {
        waist: 32,
        hip: 38,
        length: 36,
        bottom: 11,
      }),
    },
  },
  {
    id: "demo-c-omkar",
    name: "Omkar Deshpande",
    phone: "9876500016",
    namesByLang: {
      en: "Omkar Deshpande",
      hi: "ओंकार देशपांडे",
      mr: "ओंकार देशपांडे",
      ta: "ஓம்கார் தேஷ்பாண்டே",
      kn: "ಓಂಕಾರ್ ದೇಶಪಾಂಡೆ",
    },
    measurements: {
      sherwani: measurement("sherwani", {
        chest: 40,
        waist: 36,
        hip: 40,
        shoulder: 16,
        sleeve: 24,
        length: 42,
      }),
    },
  },
];

const ms = (d: number) => d * 24 * 60 * 60 * 1000;

function mkJob(opts: {
  id: string;
  jobNumber: string;
  customerId: string;
  garmentType: GarmentType;
  fabricType: string;
  fabricColor: string;
  quoted: number;
  advance: number;
  receivedDaysAgo: number;
  promisedInDays: number;
  status: JobCard["status"];
  priority?: JobCard["priority"];
  deliveredDaysAgo?: number;
}): JobCard {
  const receivedAt = new Date(now.getTime() - ms(opts.receivedDaysAgo)).toISOString();
  const promisedAt = new Date(now.getTime() + ms(opts.promisedInDays)).toISOString();
  const deliveredAt =
    opts.deliveredDaysAgo !== undefined
      ? new Date(now.getTime() - ms(opts.deliveredDaysAgo)).toISOString()
      : undefined;

  return {
    _id: opts.id,
    tailorId: TAILOR_ID,
    customerId: opts.customerId,
    jobNumber: opts.jobNumber,
    items: [
      {
        garmentType: opts.garmentType,
        quantity: 1,
      },
    ],
    fabric: { type: opts.fabricType, color: opts.fabricColor },
    pricing: {
      quoted: opts.quoted,
      advance: opts.advance,
      balance: Math.max(0, opts.quoted - opts.advance),
      currency: "INR",
    },
    dates: {
      receivedAt,
      promisedAt,
      deliveredAt,
      completedAt: deliveredAt,
    },
    status: opts.status,
    statusHistory: [{ status: "received", at: receivedAt }],
    priority: opts.priority ?? "normal",
    voiceNotes: [],
    source: "manual",
    createdAt: receivedAt,
    updatedAt: new Date().toISOString(),
  };
}

export const EXTRA_DEMO_JOBS: JobCard[] = [
  mkJob({
    id: "demo-job-p-9",
    jobNumber: "J-2026-D009",
    customerId: "demo-c-kavita",
    garmentType: "lehenga",
    fabricType: "Net",
    fabricColor: "Rose Gold",
    quoted: 6200,
    advance: 3000,
    receivedDaysAgo: 6,
    promisedInDays: 10,
    status: "cutting",
    priority: "festival",
  }),
  mkJob({
    id: "demo-job-p-10",
    jobNumber: "J-2026-D010",
    customerId: "demo-c-arjun",
    garmentType: "shirt",
    fabricType: "Egyptian Cotton",
    fabricColor: "Light Blue",
    quoted: 1800,
    advance: 600,
    receivedDaysAgo: 2,
    promisedInDays: 5,
    status: "stitching",
  }),
  mkJob({
    id: "demo-job-p-11",
    jobNumber: "J-2026-D011",
    customerId: "demo-c-divya",
    garmentType: "blouse",
    fabricType: "Chiffon",
    fabricColor: "Teal",
    quoted: 1100,
    advance: 400,
    receivedDaysAgo: 1,
    promisedInDays: 3,
    status: "received",
  }),
  mkJob({
    id: "demo-job-p-12",
    jobNumber: "J-2026-D012",
    customerId: "demo-c-harish",
    garmentType: "shirt",
    fabricType: "Cotton",
    fabricColor: "White",
    quoted: 2400,
    advance: 800,
    receivedDaysAgo: 4,
    promisedInDays: 2,
    status: "ready",
  }),
  mkJob({
    id: "demo-job-p-13",
    jobNumber: "J-2026-D013",
    customerId: "demo-c-nandini",
    garmentType: "salwar",
    fabricType: "Rayon",
    fabricColor: "Lavender",
    quoted: 950,
    advance: 350,
    receivedDaysAgo: 3,
    promisedInDays: 4,
    status: "finishing",
  }),
  mkJob({
    id: "demo-job-p-14",
    jobNumber: "J-2026-D014",
    customerId: "demo-c-omkar",
    garmentType: "sherwani",
    fabricType: "Velvet",
    fabricColor: "Midnight Blue",
    quoted: 7200,
    advance: 4000,
    receivedDaysAgo: 9,
    promisedInDays: 12,
    status: "trial",
    priority: "festival",
  }),
  mkJob({
    id: "demo-job-d-5",
    jobNumber: "J-2026-C005",
    customerId: "demo-c-kavita",
    garmentType: "blouse",
    fabricType: "Silk",
    fabricColor: "Crimson",
    quoted: 1400,
    advance: 1400,
    receivedDaysAgo: 28,
    promisedInDays: -18,
    deliveredDaysAgo: 17,
    status: "delivered",
  }),
  mkJob({
    id: "demo-job-d-6",
    jobNumber: "J-2026-C006",
    customerId: "demo-c-arjun",
    garmentType: "pant",
    fabricType: "Wool Blend",
    fabricColor: "Grey",
    quoted: 1600,
    advance: 500,
    receivedDaysAgo: 40,
    promisedInDays: -30,
    deliveredDaysAgo: 28,
    status: "delivered",
  }),
  mkJob({
    id: "demo-job-t-5",
    jobNumber: "J-2026-T005",
    customerId: "demo-c-divya",
    garmentType: "kurta",
    fabricType: "Cotton",
    fabricColor: "Indigo",
    quoted: 780,
    advance: 300,
    receivedDaysAgo: 5,
    promisedInDays: 0,
    status: "ready",
  }),
  mkJob({
    id: "demo-job-t-6",
    jobNumber: "J-2026-T006",
    customerId: "demo-c-nandini",
    garmentType: "salwar",
    fabricType: "Georgette",
    fabricColor: "Peach",
    quoted: 820,
    advance: 200,
    receivedDaysAgo: 4,
    promisedInDays: 0,
    status: "stitching",
  }),
];
