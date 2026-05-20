"use client";

import { useState } from "react";

import {
  getGarmentDefinition,
  getGarmentEmoji,
  getGarmentLabel,
} from "@/constants/garments";
import { useGarmentMeasurementFields } from "@/features/measurements/useGarmentMeasurementFields";
import { useI18n } from "@/i18n/useI18n";
import type { GarmentType } from "@/types/shared";

import styles from "./MeasurementFields.module.css";

export interface MeasurementFieldsProps {
  garmentType: GarmentType;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function MeasurementFields({
  garmentType,
  values,
  onChange,
}: MeasurementFieldsProps) {
  const { language, t } = useI18n();
  const def = getGarmentDefinition(garmentType);
  const {
    fields,
    isCustomized,
    availablePresets,
    removeField,
    moveField,
    addPresetField,
    addCustomField,
    resetToDefaults,
  } = useGarmentMeasurementFields(garmentType);

  const [editing, setEditing] = useState(false);
  const [presetKey, setPresetKey] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [quickCustomName, setQuickCustomName] = useState("");
  const [quickCustomValue, setQuickCustomValue] = useState("");

  const labelFor = (field: (typeof fields)[number]) =>
    field.labels[language] ?? field.labels.en ?? field.key;

  const handleAddPreset = () => {
    if (!presetKey) return;
    addPresetField(presetKey);
    setPresetKey("");
  };

  const handleAddCustom = () => {
    addCustomField(customLabel, language, "number");
    setCustomLabel("");
  };

  const handleAddCustomText = () => {
    addCustomField(customLabel, language, "text");
    setCustomLabel("");
  };

  const handleQuickAdd = (valueKind: "number" | "text") => {
    const name = quickCustomName.trim();
    if (!name) return;
    const key = addCustomField(name, language, valueKind);
    if (key && quickCustomValue.trim()) {
      onChange(key, quickCustomValue.trim());
    }
    setQuickCustomName("");
    setQuickCustomValue("");
  };

  if (fields.length === 0 && !editing) {
    return (
      <section className={styles.section} aria-labelledby="measurements-heading">
        <div className={styles.headerRow}>
          <h3 id="measurements-heading" className={styles.heading}>
            {t("job.wizard.measurements")} ({getGarmentEmoji(garmentType)}{" "}
            {getGarmentLabel(garmentType, language)})
          </h3>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => setEditing(true)}
          >
            {t("measurements.customize")}
          </button>
        </div>
        <p className={styles.hint}>{t("measurements.emptyHint")}</p>
        <QuickCustomMeasurementRow
          name={quickCustomName}
          value={quickCustomValue}
          onNameChange={setQuickCustomName}
          onValueChange={setQuickCustomValue}
          onAddNumber={() => handleQuickAdd("number")}
          onAddText={() => handleQuickAdd("text")}
        />
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="measurements-heading">
      <div className={styles.headerRow}>
        <h3 id="measurements-heading" className={styles.heading}>
          {t("job.wizard.measurements")} ({def?.emoji ?? getGarmentEmoji(garmentType)}{" "}
          {def?.labels[language] ?? getGarmentLabel(garmentType, language)})
          {isCustomized ? (
            <span className={styles.customBadge}>{t("measurements.saved")}</span>
          ) : null}
        </h3>
        <button
          type="button"
          className={styles.editBtn}
          onClick={() => setEditing((e) => !e)}
          aria-expanded={editing}
        >
          {editing ? t("measurements.done") : t("measurements.customize")}
        </button>
      </div>

      {editing ? (
        <div className={styles.editor} role="region" aria-label={t("measurements.customize")}>
          <p className={styles.editorHint}>{t("measurements.editorHint")}</p>
          <ul className={styles.fieldList}>
            {fields.map((field, index) => (
              <li key={field.key} className={styles.fieldRow}>
                <span className={styles.fieldName}>{labelFor(field)}</span>
                <span className={styles.fieldKey}>{field.key}</span>
                <div className={styles.fieldActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => moveField(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${labelFor(field)} up`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => moveField(index, 1)}
                    disabled={index === fields.length - 1}
                    aria-label={`Move ${labelFor(field)} down`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                    onClick={() => removeField(field.key)}
                    aria-label={`Remove ${labelFor(field)}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.addRow}>
            {availablePresets.length > 0 ? (
              <>
                <select
                  className={styles.select}
                  value={presetKey}
                  onChange={(e) => setPresetKey(e.target.value)}
                  aria-label={t("measurements.addPreset")}
                >
                  <option value="">{t("measurements.addPreset")}</option>
                  {availablePresets.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.labels[language] ?? p.labels.en ?? p.key}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={handleAddPreset}
                  disabled={!presetKey}
                >
                  {t("common.add")}
                </button>
              </>
            ) : null}
          </div>

          <div className={styles.addRow}>
            <input
              type="text"
              className={styles.textInput}
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder={t("measurements.customPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
            />
            <button
              type="button"
              className={styles.smallBtn}
              onClick={handleAddCustom}
              disabled={!customLabel.trim()}
            >
              {t("measurements.addCustom")}
            </button>
            <button
              type="button"
              className={styles.smallBtnSecondary}
              onClick={handleAddCustomText}
              disabled={!customLabel.trim()}
              title={t("measurements.addCustomTextHint")}
            >
              {t("measurements.addCustomText")}
            </button>
          </div>

          <button
            type="button"
            className={styles.resetBtn}
            onClick={resetToDefaults}
            disabled={!isCustomized && fields.length === 0}
          >
            {t("measurements.resetDefaults")}
          </button>
        </div>
      ) : null}

      <QuickCustomMeasurementRow
        name={quickCustomName}
        value={quickCustomValue}
        onNameChange={setQuickCustomName}
        onValueChange={setQuickCustomValue}
        onAddNumber={() => handleQuickAdd("number")}
        onAddText={() => handleQuickAdd("text")}
      />

      {fields.length > 0 ? (
        <div className={styles.grid}>
          {fields.map((field) => {
            const isTextField = field.valueKind === "text";
            return (
              <label key={field.key} className={styles.label}>
                <span>
                  {labelFor(field)}
                  {isTextField ? (
                    <span className={styles.textBadge}>{t("measurements.textField")}</span>
                  ) : null}
                </span>
                <input
                  type="text"
                  inputMode={isTextField ? "text" : "decimal"}
                  value={values[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className={styles.input}
                  placeholder={
                    isTextField
                      ? t("measurements.textValuePlaceholder")
                      : t("measurements.valuePlaceholder")
                  }
                />
              </label>
            );
          })}
        </div>
      ) : editing ? null : (
        <p className={styles.hint}>{t("measurements.emptyHint")}</p>
      )}
    </section>
  );
}

function QuickCustomMeasurementRow({
  name,
  value,
  onNameChange,
  onValueChange,
  onAddNumber,
  onAddText,
}: {
  name: string;
  value: string;
  onNameChange: (v: string) => void;
  onValueChange: (v: string) => void;
  onAddNumber: () => void;
  onAddText: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className={styles.quickCustomBlock}>
      <p className={styles.quickCustomHint}>{t("measurements.quickAddHint")}</p>
      <div className={styles.quickCustomRow}>
        <label className={styles.quickCustomLabel}>
          <span>{t("measurements.customNameLabel")}</span>
          <input
            type="text"
            className={styles.textInput}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t("measurements.customPlaceholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddNumber();
              }
            }}
          />
        </label>
        <label className={styles.quickCustomLabel}>
          <span>{t("measurements.customValueLabel")}</span>
          <input
            type="text"
            className={styles.textInput}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={t("measurements.valuePlaceholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddNumber();
              }
            }}
          />
        </label>
        <div className={styles.quickCustomActions}>
          <button
            type="button"
            className={styles.smallBtn}
            onClick={onAddNumber}
            disabled={!name.trim()}
          >
            {t("measurements.addCustom")}
          </button>
          <button
            type="button"
            className={styles.smallBtnSecondary}
            onClick={onAddText}
            disabled={!name.trim()}
            title={t("measurements.addCustomTextHint")}
          >
            {t("measurements.addCustomText")}
          </button>
        </div>
      </div>
    </div>
  );
}
