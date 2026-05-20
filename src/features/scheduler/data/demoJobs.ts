import type { JobCard } from "@/types/shared";

const now = new Date();
const tailorId = "demo-tailor";
const ms = (d: number) => d * 24 * 60 * 60 * 1000;

interface DemoEntry {
  job: JobCard;
  customerName: string;
}

function mk(opts: {
  id: string;
  jobNumber: string;
  customerId: string;
  customerName: string;
  garmentType: JobCard["items"][number]["garmentType"];
  garmentLabel?: string;
  quantity?: number;
  fabricType: string;
  fabricColor: string;
  quoted: number;
  advance: number;
  receivedDaysAgo: number;
  promisedInDays: number;
  trialInDays?: number;
  status: JobCard["status"];
  priority?: JobCard["priority"];
  measurements?: Record<string, number>;
  notes?: string;
  deliveredDaysAgo?: number;
}): DemoEntry {
  const receivedAt = new Date(now.getTime() - ms(opts.receivedDaysAgo)).toISOString();
  const promisedAt = new Date(now.getTime() + ms(opts.promisedInDays)).toISOString();
  const trialAt = opts.trialInDays !== undefined
    ? new Date(now.getTime() + ms(opts.trialInDays)).toISOString()
    : undefined;
  const deliveredAt = opts.deliveredDaysAgo !== undefined
    ? new Date(now.getTime() - ms(opts.deliveredDaysAgo)).toISOString()
    : undefined;
  const completedAt = deliveredAt;

  const balance = Math.max(0, opts.quoted - opts.advance);

  const job: JobCard = {
    _id: opts.id,
    tailorId,
    customerId: opts.customerId,
    jobNumber: opts.jobNumber,
    items: [
      {
        garmentType: opts.garmentType,
        garmentLabel: opts.garmentLabel,
        quantity: opts.quantity ?? 1,
        customMeasurements: opts.measurements,
        notes: opts.notes,
      },
    ],
    fabric: {
      type: opts.fabricType,
      color: opts.fabricColor,
    },
    pricing: {
      quoted: opts.quoted,
      advance: opts.advance,
      balance,
      currency: "INR",
    },
    dates: {
      receivedAt,
      promisedAt,
      trialAt,
      completedAt,
      deliveredAt,
    },
    status: opts.status,
    statusHistory: [
      { status: "received", at: receivedAt, note: "Order taken" },
      ...(opts.status !== "received"
        ? [
            {
              status: opts.status,
              at: new Date(now.getTime() - ms(Math.max(0, opts.receivedDaysAgo - 2))).toISOString(),
              note: "Auto-progress",
            },
          ]
        : []),
    ],
    priority: opts.priority ?? "normal",
    voiceNotes: [],
    source: "manual",
    createdAt: receivedAt,
    updatedAt: new Date().toISOString(),
  };

  return { job, customerName: opts.customerName };
}

export const DEMO_PENDING_JOBS: DemoEntry[] = [
  mk({
    id: "demo-job-p-1",
    jobNumber: "J-2026-D001",
    customerId: "demo-c-asha",
    customerName: "Asha Devi",
    garmentType: "blouse",
    quantity: 2,
    fabricType: "Silk",
    fabricColor: "Maroon",
    quoted: 1200,
    advance: 400,
    receivedDaysAgo: 3,
    promisedInDays: 4,
    trialInDays: 2,
    status: "stitching",
    priority: "normal",
    measurements: { bust: 36, waist: 32, shoulder: 13, sleeve: 6, length: 14 },
    notes: "Hook closure, scallop neckline",
  }),
  mk({
    id: "demo-job-p-2",
    jobNumber: "J-2026-D002",
    customerId: "demo-c-meera",
    customerName: "Meera Sharma",
    garmentType: "lehenga",
    quantity: 1,
    fabricType: "Georgette",
    fabricColor: "Royal Blue",
    quoted: 4500,
    advance: 2000,
    receivedDaysAgo: 8,
    promisedInDays: 6,
    trialInDays: 3,
    status: "cutting",
    priority: "festival",
    measurements: { waist: 30, hip: 40, length: 40, flare: 90 },
    notes: "Wedding wear — add 3 pleats, gold embroidery border",
  }),
  mk({
    id: "demo-job-p-3",
    jobNumber: "J-2026-D003",
    customerId: "demo-c-rajesh",
    customerName: "Rajesh Kumar",
    garmentType: "shirt",
    quantity: 3,
    fabricType: "Cotton",
    fabricColor: "White / Sky / Cream",
    quoted: 1500,
    advance: 500,
    receivedDaysAgo: 1,
    promisedInDays: 9,
    status: "received",
    priority: "normal",
    measurements: { chest: 42, waist: 38, shoulder: 17, sleeve: 24, length: 28, neck: 16, collar: 16 },
    notes: "Regular fit, button-down collar on cream one",
  }),
  mk({
    id: "demo-job-p-4",
    jobNumber: "J-2026-D004",
    customerId: "demo-c-sunita",
    customerName: "Sunita Agarwal",
    garmentType: "salwar",
    quantity: 1,
    fabricType: "Linen",
    fabricColor: "Mint Green",
    quoted: 700,
    advance: 200,
    receivedDaysAgo: 5,
    promisedInDays: 1,
    status: "finishing",
    priority: "normal",
    measurements: { waist: 36, hip: 42, length: 38, bottom: 12 },
    notes: "Side pocket on left",
  }),
  mk({
    id: "demo-job-p-5",
    jobNumber: "J-2026-D005",
    customerId: "demo-c-lakshmi",
    customerName: "Lakshmi Patel",
    garmentType: "blouse",
    quantity: 1,
    fabricType: "Brocade",
    fabricColor: "Gold",
    quoted: 1800,
    advance: 800,
    receivedDaysAgo: 10,
    promisedInDays: -1,
    status: "trial",
    priority: "urgent",
    measurements: { bust: 38, waist: 34, shoulder: 14, sleeve: 5, length: 15 },
    notes: "Bridal — heavy work, fit-trial pending",
  }),
  mk({
    id: "demo-job-p-6",
    jobNumber: "J-2026-D006",
    customerId: "demo-c-vikas",
    customerName: "Vikas Singh",
    garmentType: "pant",
    quantity: 2,
    fabricType: "Polyester",
    fabricColor: "Charcoal",
    quoted: 1400,
    advance: 400,
    receivedDaysAgo: 2,
    promisedInDays: 8,
    status: "received",
    priority: "normal",
    measurements: { waist: 34, hip: 40, length: 40, thigh: 22, knee: 16, bottom: 14 },
    notes: "Flat front, 2 back pockets",
  }),
  mk({
    id: "demo-job-p-7",
    jobNumber: "J-2026-D007",
    customerId: "demo-c-amit",
    customerName: "Amit Jain",
    garmentType: "sherwani",
    quantity: 1,
    fabricType: "Silk",
    fabricColor: "Ivory",
    quoted: 5800,
    advance: 2500,
    receivedDaysAgo: 12,
    promisedInDays: 14,
    trialInDays: 7,
    status: "stitching",
    priority: "festival",
    measurements: { chest: 42, waist: 38, hip: 42, shoulder: 17, sleeve: 25, length: 44 },
    notes: "Mandarin collar, mother-of-pearl buttons",
  }),
  mk({
    id: "demo-job-p-8",
    jobNumber: "J-2026-D008",
    customerId: "demo-c-priya",
    customerName: "Priya Iyer",
    garmentType: "kurta",
    quantity: 1,
    fabricType: "Khadi",
    fabricColor: "Off-white",
    quoted: 850,
    advance: 300,
    receivedDaysAgo: 4,
    promisedInDays: 0,
    status: "ready",
    priority: "normal",
    measurements: { chest: 36, waist: 32, hip: 38, shoulder: 13, sleeve: 21, length: 40, neck: 15 },
    notes: "Loose cut, side slits",
  }),
];

export const DEMO_DONE_JOBS: DemoEntry[] = [
  mk({
    id: "demo-job-d-1",
    jobNumber: "J-2026-C001",
    customerId: "demo-c-geeta",
    customerName: "Geeta Verma",
    garmentType: "blouse",
    quantity: 1,
    fabricType: "Silk",
    fabricColor: "Emerald",
    quoted: 1500,
    advance: 500,
    receivedDaysAgo: 18,
    promisedInDays: -10,
    deliveredDaysAgo: 9,
    status: "delivered",
    measurements: { bust: 34, waist: 30, shoulder: 13, armhole: 15, sleeve: 5, length: 14 },
    notes: "Loved the puff sleeves",
  }),
  mk({
    id: "demo-job-d-2",
    jobNumber: "J-2026-C002",
    customerId: "demo-c-ramesh",
    customerName: "Ramesh Yadav",
    garmentType: "shirt",
    quantity: 2,
    fabricType: "Cotton",
    fabricColor: "Navy / Striped",
    quoted: 1100,
    advance: 1100,
    receivedDaysAgo: 22,
    promisedInDays: -15,
    deliveredDaysAgo: 14,
    status: "delivered",
    measurements: { chest: 44, waist: 40, shoulder: 18, sleeve: 25, length: 29, neck: 17, collar: 17 },
    notes: "Full payment received",
  }),
  mk({
    id: "demo-job-d-3",
    jobNumber: "J-2026-C003",
    customerId: "demo-c-asha",
    customerName: "Asha Devi",
    garmentType: "kurta",
    quantity: 1,
    fabricType: "Linen",
    fabricColor: "Peach",
    quoted: 900,
    advance: 300,
    receivedDaysAgo: 35,
    promisedInDays: -25,
    deliveredDaysAgo: 24,
    status: "delivered",
    measurements: { chest: 38, waist: 34, hip: 40, shoulder: 14, sleeve: 22, length: 42, neck: 16 },
    notes: "Returning customer — VIP",
  }),
  mk({
    id: "demo-job-d-4",
    jobNumber: "J-2026-C004",
    customerId: "demo-c-meera",
    customerName: "Meera Sharma",
    garmentType: "blouse",
    quantity: 3,
    fabricType: "Crepe",
    fabricColor: "Pink / Yellow / Teal",
    quoted: 2700,
    advance: 1000,
    receivedDaysAgo: 30,
    promisedInDays: -20,
    deliveredDaysAgo: 19,
    status: "delivered",
    measurements: { bust: 38, waist: 34, shoulder: 14, armhole: 17, sleeve: 6, length: 15 },
    notes: "Festival set — referred 2 friends",
  }),
];

export interface DemoJobEntry {
  job: JobCard;
  customerName: string;
}
