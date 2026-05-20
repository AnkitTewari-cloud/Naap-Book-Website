import type { SupportedLanguage } from "@/i18n/strings";

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

export interface GarmentDefinition {
  type: GarmentType;
  emoji: string;
  labels: Partial<Record<SupportedLanguage, string>>;
  measurementFields: {
    key: string;
    labels: Partial<Record<SupportedLanguage, string>>;
  }[];
}

const COMMON_FIELDS = {
  chest: { en: "Chest", hi: "सीना", mr: "छाती", ta: "மார்பு", kn: "ಎದೆ" },
  waist: { en: "Waist", hi: "कमर", mr: "कंबर", ta: "இடுப்பு", kn: "ಸೊಂಟ" },
  hip: { en: "Hip", hi: "कुल्हा", mr: "नितंब", ta: "இடுப்பு", kn: "ತೊಡೆ" },
  shoulder: { en: "Shoulder", hi: "कंधा", mr: "खांदा", ta: "தோள்", kn: "ಭುಜ" },
  sleeve: { en: "Sleeve", hi: "बाँह", mr: "आस्तीन", ta: "சட்டை கை", kn: "ತೋಳು" },
  length: { en: "Length", hi: "लंबाई", mr: "लांबी", ta: "நீளம்", kn: "ಉದ್ದ" },
  neck: { en: "Neck", hi: "गला", mr: "गळा", ta: "கழுத்து", kn: "ಕುತ್ತಿಗೆ" },
  armhole: { en: "Armhole", hi: "बगल", mr: "बगल", ta: "கைப்பந்தல்", kn: "ಕಂಕುಳು" },
} as const;

export const GARMENT_DEFINITIONS: GarmentDefinition[] = [
  {
    type: "kurta",
    emoji: "👕",
    labels: { en: "Kurta", hi: "कुर्ता", mr: "कुर्ता", ta: "குர்தா", kn: "ಕುರ್ತಾ" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "shoulder", labels: COMMON_FIELDS.shoulder },
      { key: "sleeve", labels: COMMON_FIELDS.sleeve },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "neck", labels: COMMON_FIELDS.neck },
    ],
  },
  {
    type: "blouse",
    emoji: "👚",
    labels: { en: "Blouse", hi: "ब्लाउज़", mr: "ब्लाउज", ta: "ரவிக்கை", kn: "ರವಿಕೆ" },
    measurementFields: [
      { key: "bust", labels: { en: "Bust", hi: "वक्ष", mr: "वक्ष", ta: "மார்பு", kn: "ಎದೆ" } },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "shoulder", labels: COMMON_FIELDS.shoulder },
      { key: "armhole", labels: COMMON_FIELDS.armhole },
      { key: "sleeve", labels: COMMON_FIELDS.sleeve },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "shirt",
    emoji: "👔",
    labels: { en: "Shirt", hi: "शर्ट", mr: "शर्ट", ta: "சட்டை", kn: "ಶರ್ಟ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "shoulder", labels: COMMON_FIELDS.shoulder },
      { key: "sleeve", labels: COMMON_FIELDS.sleeve },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "neck", labels: COMMON_FIELDS.neck },
      { key: "collar", labels: { en: "Collar", hi: "कॉलर" } },
    ],
  },
  {
    type: "pant",
    emoji: "👖",
    labels: { en: "Pant", hi: "पैंट", mr: "पँट", ta: "கால்சட்டை", kn: "ಪ್ಯಾಂಟ್" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "thigh", labels: { en: "Thigh", hi: "जांघ", mr: "मांडी" } },
      { key: "knee", labels: { en: "Knee", hi: "घुटना", mr: "गुडघा" } },
      { key: "bottom", labels: { en: "Bottom", hi: "मोहरी" } },
    ],
  },
  {
    type: "salwar",
    emoji: "👖",
    labels: { en: "Salwar", hi: "सलवार", mr: "सलवार", kn: "ಸಲ್ವಾರ್" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "bottom", labels: { en: "Bottom", hi: "मोहरी" } },
    ],
  },
  {
    type: "sherwani",
    emoji: "🤵",
    labels: { en: "Sherwani", hi: "शेरवानी", kn: "ಶೆರ್ವಾನಿ" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "shoulder", labels: COMMON_FIELDS.shoulder },
      { key: "sleeve", labels: COMMON_FIELDS.sleeve },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "suit",
    emoji: "🧥",
    labels: { en: "Suit", hi: "सूट", kn: "ಸೂಟ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "shoulder", labels: COMMON_FIELDS.shoulder },
      { key: "sleeve", labels: COMMON_FIELDS.sleeve },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "lehenga",
    emoji: "👗",
    labels: { en: "Lehenga", hi: "लहंगा", kn: "ಲೆಹೆಂಗಾ" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "flare", labels: { en: "Flare", hi: "घेर" } },
    ],
  },
  {
    type: "saree_fall",
    emoji: "🥻",
    labels: { en: "Saree Fall/Pico", hi: "साड़ी फॉल", kn: "ಸೀರೆ ಫಾಲ್" },
    measurementFields: [],
  },
  {
    type: "dupatta",
    emoji: "🧣",
    labels: { en: "Dupatta", hi: "दुपट्टा", kn: "ದುಪ್ಪಟ್ಟಾ" },
    measurementFields: [],
  },
  {
    type: "petticoat",
    emoji: "🩳",
    labels: { en: "Petticoat", hi: "पेटीकोट", kn: "ಪೆಟ್ಟಿಕೋಟ್" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "kameez",
    emoji: "👚",
    labels: { en: "Kameez", hi: "कमीज़", kn: "ಕಮೀಜ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "shoulder", labels: COMMON_FIELDS.shoulder },
      { key: "sleeve", labels: COMMON_FIELDS.sleeve },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "churidar",
    emoji: "👖",
    labels: { en: "Churidar", hi: "चूड़ीदार", kn: "ಚೂಡಿದಾರ್" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "nightgown",
    emoji: "🌙",
    labels: { en: "Nightgown", hi: "रात का गाउन", kn: "ರಾತ್ರಿ ಗೌನ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "anarkali",
    emoji: "👗",
    labels: { en: "Anarkali", hi: "अनारकली", kn: "ಅನಾರಕಲಿ" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "flare", labels: { en: "Flare", hi: "घेर" } },
    ],
  },
  {
    type: "sharara",
    emoji: "👗",
    labels: { en: "Sharara", hi: "शरारा", kn: "ಶರಾರಾ" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "flare", labels: { en: "Flare", hi: "घेर" } },
    ],
  },
  {
    type: "palazzo",
    emoji: "👖",
    labels: { en: "Palazzo", hi: "पलाज़ो", kn: "ಪಲಾಜ್ಜೋ" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
      { key: "bottom", labels: { en: "Bottom", hi: "मोहरी" } },
    ],
  },
  {
    type: "blazer",
    emoji: "🧥",
    labels: { en: "Blazer", hi: "ब्लेज़र", kn: "ಬ್ಲೇಜರ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "shoulder", labels: COMMON_FIELDS.shoulder },
      { key: "sleeve", labels: COMMON_FIELDS.sleeve },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "waistcoat",
    emoji: "🦺",
    labels: { en: "Waistcoat", hi: "वेस्टकोट", kn: "ವೆಸ್ಟ್ಕೋಟ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "skirt",
    emoji: "👗",
    labels: { en: "Skirt", hi: "स्कर्ट", kn: "ಸ್ಕರ್ಟ್" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "gown",
    emoji: "👗",
    labels: { en: "Gown", hi: "गाउन", kn: "ಗೌನ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "hip", labels: COMMON_FIELDS.hip },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "frock",
    emoji: "👗",
    labels: { en: "Frock", hi: "फ्रॉक", kn: "ಫ್ರಾಕ್" },
    measurementFields: [
      { key: "chest", labels: COMMON_FIELDS.chest },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "choli",
    emoji: "👚",
    labels: { en: "Choli", hi: "चोली", kn: "ಚೋಲಿ" },
    measurementFields: [
      { key: "bust", labels: { en: "Bust", hi: "वक्ष" } },
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "saree",
    emoji: "🥻",
    labels: { en: "Saree", hi: "साड़ी", kn: "ಸೀರೆ" },
    measurementFields: [
      { key: "waist", labels: COMMON_FIELDS.waist },
      { key: "length", labels: COMMON_FIELDS.length },
    ],
  },
  {
    type: "custom",
    emoji: "✂️",
    labels: { en: "Custom", hi: "अन्य", kn: "ಬೇರೆ" },
    measurementFields: [],
  },
];

export function getGarmentDefinition(
  type: GarmentType
): GarmentDefinition | undefined {
  return GARMENT_DEFINITIONS.find((g) => g.type === type);
}

export function getDefaultMeasurementFields(
  type: GarmentType
): GarmentDefinition["measurementFields"] {
  return getGarmentDefinition(type)?.measurementFields ?? [];
}

/** All preset measurement keys (for add-field picker). */
export function getMeasurementFieldPresets(): GarmentDefinition["measurementFields"] {
  const seen = new Set<string>();
  const out: GarmentDefinition["measurementFields"] = [];
  for (const def of GARMENT_DEFINITIONS) {
    for (const field of def.measurementFields) {
      if (seen.has(field.key)) continue;
      seen.add(field.key);
      out.push(field);
    }
  }
  const commonKeys = Object.keys(COMMON_FIELDS) as (keyof typeof COMMON_FIELDS)[];
  for (const key of commonKeys) {
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ key, labels: COMMON_FIELDS[key] });
  }
  return out.sort((a, b) =>
    (a.labels.en ?? a.key).localeCompare(b.labels.en ?? b.key)
  );
}

export function getGarmentLabel(
  type: GarmentType,
  language: SupportedLanguage
): string {
  const def = getGarmentDefinition(type);
  if (!def) return type;
  return def.labels[language] ?? def.labels.en ?? type;
}

export function getGarmentEmoji(type: GarmentType): string {
  return getGarmentDefinition(type)?.emoji ?? "✂️";
}
