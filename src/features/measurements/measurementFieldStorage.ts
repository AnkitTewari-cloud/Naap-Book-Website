import { getDefaultMeasurementFields } from "@/constants/garments";
import type { GarmentDefinition } from "@/constants/garments";
import type { GarmentType } from "@/types/shared";

const STORAGE_KEY = "naapbook_measurement_field_configs_v1";

export type StoredMeasurementField = GarmentDefinition["measurementFields"][number] & {
  /** When "text", values are stored as free-form notes (not parsed as numbers). */
  valueKind?: "number" | "text";
};

type ConfigMap = Partial<Record<GarmentType, StoredMeasurementField[]>>;

function readAll(): ConfigMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ConfigMap;
  } catch {
    return {};
  }
}

function writeAll(map: ConfigMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

export function loadSavedFields(
  garmentType: GarmentType
): StoredMeasurementField[] | null {
  const saved = readAll()[garmentType];
  if (saved === undefined) return null;
  return saved;
}

export function saveFields(
  garmentType: GarmentType,
  fields: StoredMeasurementField[]
): void {
  const map = readAll();
  map[garmentType] = fields;
  writeAll(map);
}

export function clearSavedFields(garmentType: GarmentType): void {
  const map = readAll();
  delete map[garmentType];
  writeAll(map);
}

export function getEffectiveMeasurementFields(
  garmentType: GarmentType
): StoredMeasurementField[] {
  const saved = loadSavedFields(garmentType);
  if (saved) return saved;
  return [...getDefaultMeasurementFields(garmentType)];
}

export function hasCustomMeasurementFields(garmentType: GarmentType): boolean {
  return loadSavedFields(garmentType) !== null;
}
