"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getDefaultMeasurementFields,
  getMeasurementFieldPresets,
} from "@/constants/garments";
import type { SupportedLanguage } from "@/i18n/strings";
import type { GarmentType } from "@/types/shared";

import {
  clearSavedFields,
  getEffectiveMeasurementFields,
  hasCustomMeasurementFields,
  saveFields,
  type StoredMeasurementField,
} from "./measurementFieldStorage";

function slugKey(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  return base || "custom_field";
}

function uniqueKey(base: string, keys: Set<string>): string {
  let key = base;
  let n = 2;
  while (keys.has(key)) {
    key = `${base}_${n++}`;
  }
  return key;
}

export function useGarmentMeasurementFields(garmentType: GarmentType) {
  const defaults = useMemo(
    () => getDefaultMeasurementFields(garmentType),
    [garmentType]
  );
  const presets = useMemo(() => getMeasurementFieldPresets(), []);

  const [fields, setFields] = useState<StoredMeasurementField[]>(() =>
    getEffectiveMeasurementFields(garmentType)
  );
  const [isCustomized, setIsCustomized] = useState(() =>
    hasCustomMeasurementFields(garmentType)
  );

  useEffect(() => {
    setFields(getEffectiveMeasurementFields(garmentType));
    setIsCustomized(hasCustomMeasurementFields(garmentType));
  }, [garmentType]);

  const persist = useCallback(
    (next: StoredMeasurementField[]) => {
      setFields(next);
      saveFields(garmentType, next);
      setIsCustomized(true);
    },
    [garmentType]
  );

  const resetToDefaults = useCallback(() => {
    clearSavedFields(garmentType);
    setFields([...defaults]);
    setIsCustomized(false);
  }, [garmentType, defaults]);

  const removeField = useCallback(
    (key: string) => {
      persist(fields.filter((f) => f.key !== key));
    },
    [fields, persist]
  );

  const moveField = useCallback(
    (index: number, direction: -1 | 1) => {
      const target = index + direction;
      if (target < 0 || target >= fields.length) return;
      const next = [...fields];
      const tmp = next[index]!;
      next[index] = next[target]!;
      next[target] = tmp;
      persist(next);
    },
    [fields, persist]
  );

  const addPresetField = useCallback(
    (presetKey: string) => {
      if (fields.some((f) => f.key === presetKey)) return;
      const preset = presets.find((p) => p.key === presetKey);
      if (!preset) return;
      persist([...fields, preset]);
    },
    [fields, persist, presets]
  );

  const addCustomField = useCallback(
    (
      label: string,
      language: SupportedLanguage,
      valueKind: "number" | "text" = "number"
    ): string | undefined => {
      const trimmed = label.trim();
      if (!trimmed) return undefined;
      const keys = new Set(fields.map((f) => f.key));
      const key = uniqueKey(slugKey(trimmed), keys);
      const entry: StoredMeasurementField = {
        key,
        labels: { [language]: trimmed, en: trimmed },
        ...(valueKind === "text" ? { valueKind: "text" as const } : {}),
      };
      persist([...fields, entry]);
      return key;
    },
    [fields, persist]
  );

  const availablePresets = useMemo(
    () => presets.filter((p) => !fields.some((f) => f.key === p.key)),
    [presets, fields]
  );

  return {
    fields,
    isCustomized,
    defaults,
    availablePresets,
    removeField,
    moveField,
    addPresetField,
    addCustomField,
    resetToDefaults,
  };
}
