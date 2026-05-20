"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  GARMENT_TYPES,
  getGarmentEmoji,
  getGarmentLabel,
} from "@/constants/garments";
import { BillDocument } from "@/features/billing/BillDocument";
import { DEMO_TAILOR } from "@/features/demo/demoFixtures";
import { DUMMY_GST_RATE } from "@/features/dashboard/dummyDashboardData";
import { MeasurementFields } from "@/features/job/MeasurementFields";
import { getEffectiveMeasurementFields } from "@/features/measurements/measurementFieldStorage";
import { getCustomerDisplayName } from "@/features/scheduler/components/JobCardManifest";
import { useI18n } from "@/i18n/useI18n";
import {
  useCreateCustomerMutation,
  useListCustomersQuery,
} from "@/store/api/customerApi";
import { useCreateJobMutation } from "@/store/api/jobCardApi";
import type {
  CreateJobCardInput,
  Customer,
  GarmentType,
  MeasurementSet,
} from "@/types/shared";
import { coerceMeasurementValue } from "@/utils/measurements";
import { isoDateOnly } from "@/utils/dates";
import { normalizePhone } from "@/utils/phone";

import styles from "./new-job.module.css";

function phoneDigitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

function phonesMatch(a: string, b: string): boolean {
  const da = phoneDigitsOnly(a);
  const db = phoneDigitsOnly(b);
  if (da.length < 10 || db.length < 10) return false;
  return da.slice(-10) === db.slice(-10);
}

export default function NewJobPage() {
  return (
    <Suspense
      fallback={
        <div className={`${styles.page} stitch-page-pattern`}>
          <p className={styles.loading}>Loading…</p>
        </div>
      }
    >
      <NewJobForm />
    </Suspense>
  );
}

function NewJobForm() {
  const { t, language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("customerId");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [garmentType, setGarmentType] = useState<GarmentType | null>(null);
  const [garmentLabel, setGarmentLabel] = useState("");
  const [garmentPickerOpen, setGarmentPickerOpen] = useState(true);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [promisedAt, setPromisedAt] = useState("");
  const [quoted, setQuoted] = useState("");
  const [advance, setAdvance] = useState("");
  const [withGst, setWithGst] = useState(true);
  const [showSampleBill, setShowSampleBill] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const phoneDigits = phoneDigitsOnly(customerPhone);
  const phoneComplete = phoneDigits.length === 10;

  const { data: customersData } = useListCustomersQuery(
    phoneComplete ? { search: phoneDigits, limit: 50 } : { limit: 200 }
  );
  const [createCustomer, { isLoading: isCreatingCustomer }] =
    useCreateCustomerMutation();
  const [createJob, { isLoading: isCreatingJob }] = useCreateJobMutation();

  const matchedCustomer = useMemo(() => {
    if (!phoneComplete) return null;
    const items = customersData?.items ?? [];
    return items.find((c) => c.phone && phonesMatch(c.phone, customerPhone)) ?? null;
  }, [phoneComplete, customersData?.items, customerPhone]);

  useEffect(() => {
    if (!matchedCustomer || customerName.trim()) return;
    setCustomerName(getCustomerDisplayName(matchedCustomer, language));
  }, [matchedCustomer, customerName, language]);

  useEffect(() => {
    if (!preselectedId) return;
    const found = customersData?.items.find((c) => c._id === preselectedId);
    if (found) {
      setCustomerName(getCustomerDisplayName(found, language));
      setCustomerPhone(
        found.phone ? phoneDigitsOnly(found.phone).slice(-10) : ""
      );
    }
  }, [preselectedId, customersData, language]);

  const resolvedGarmentLabel = useMemo(() => {
    if (!garmentType) return "";
    const typed = garmentLabel.trim();
    if (typed) return typed;
    return getGarmentLabel(garmentType, language);
  }, [garmentType, garmentLabel, language]);

  const canSubmit = useMemo(
    () =>
      Boolean(customerName.trim()) &&
      phoneComplete &&
      Boolean(garmentType) &&
      (garmentType !== "custom" || Boolean(garmentLabel.trim())) &&
      Boolean(promisedAt),
    [customerName, phoneComplete, garmentType, garmentLabel, promisedAt]
  );

  const buildMeasurementSnapshot = (): MeasurementSet | undefined => {
    if (!garmentType) return undefined;
    const fieldDefs = getEffectiveMeasurementFields(garmentType);
    const defByKey = new Map(fieldDefs.map((f) => [f.key, f]));
    const fields: Record<string, number> = {};
    const textFields: Record<string, string> = {};
    for (const [key, raw] of Object.entries(measurements)) {
      const def = defByKey.get(key);
      if (!def) continue;
      const coerced = coerceMeasurementValue(raw, {
        textOnly: def.valueKind === "text",
      });
      if (coerced.text) textFields[key] = coerced.text;
      if (coerced.number !== undefined) fields[key] = coerced.number;
    }
    if (Object.keys(fields).length === 0 && Object.keys(textFields).length === 0) {
      return undefined;
    }
    return {
      garmentType,
      garmentLabel: resolvedGarmentLabel || undefined,
      unit: "inch",
      fields,
      ...(Object.keys(textFields).length > 0 ? { textFields } : {}),
      takenAt: new Date().toISOString(),
      takenBy: "tailor",
    };
  };

  const resolveCustomer = async (): Promise<Customer | null> => {
    if (matchedCustomer) return matchedCustomer;
    try {
      return await createCustomer({
        name: customerName.trim(),
        phone: normalizePhone(customerPhone),
      }).unwrap();
    } catch {
      setFormError("Could not save customer. Try again.");
      return null;
    }
  };

  const submit = async () => {
    if (!canSubmit || !garmentType) return;
    setFormError(null);

    const customer = await resolveCustomer();
    if (!customer) return;

    const quotedNum = quoted ? Number(quoted) : undefined;
    const advanceNum = advance ? Number(advance) : undefined;
    const balance =
      quotedNum !== undefined
        ? Math.max(0, quotedNum - (advanceNum ?? 0))
        : undefined;

    const snapshot = buildMeasurementSnapshot();
    const payload: CreateJobCardInput = {
      customerId: customer._id,
      items: [
        {
          garmentType,
          garmentLabel: resolvedGarmentLabel,
          quantity: 1,
          ...(snapshot ? { measurementSnapshot: snapshot } : {}),
        },
      ],
      pricing: {
        currency: "INR",
        quoted: quotedNum,
        advance: advanceNum,
        balance,
      },
      dates: { promisedAt: new Date(promisedAt).toISOString() },
      priority: "normal",
    };

    try {
      const job = await createJob(payload).unwrap();
      router.replace(`/jobs/${job._id}`);
    } catch {
      setFormError("Could not create job. Try again.");
    }
  };

  const busy = isCreatingCustomer || isCreatingJob;
  const quotedNum = quoted ? Number(quoted) : 0;
  const advanceNum = advance ? Number(advance) : 0;
  const billDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const billItems =
    garmentType && (quotedNum > 0 || showSampleBill)
      ? [
          {
            description: getGarmentLabel(garmentType, language),
            garmentType,
            qty: 1,
            rate: quotedNum > 0 ? quotedNum : 2800,
          },
        ]
      : showSampleBill
        ? [
            {
              description: "Blouse stitching",
              garmentType: "blouse" as GarmentType,
              qty: 1,
              rate: 2800,
            },
          ]
        : [];

  const displayBill =
    showSampleBill ||
    (billItems.length > 0 && customerName.trim() && garmentType);

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.backLink}
          >
            <MaterialIcon name="arrow_back" size={20} />
            {t("common.back")}
          </button>
          <h1 className={styles.pageTitle}>{t("job.new")}</h1>
          <p className={styles.pageSubtitle}>
            Customer lookup, garment, measurements, delivery, and bill preview.
          </p>
        </header>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className={styles.formBody}>
            <section className={styles.sectionCard} aria-labelledby="customer-heading">
              <h2 id="customer-heading" className={styles.sectionTitle}>
                <span className={styles.sectionTitleIcon} aria-hidden>
                  <MaterialIcon name="person" size={18} />
                </span>
                Customer
              </h2>
              <label className={styles.label}>
                <span>Phone number</span>
                <div className={styles.phoneWrap}>
                  <span className={styles.phoneIcon} aria-hidden>
                    <MaterialIcon name="phone" size={20} />
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="10-digit mobile"
                    className={`${styles.input} ${styles.phoneInput}`}
                    required
                  />
                </div>
              </label>
              <label className={styles.label}>
                <span>Customer name</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  autoComplete="name"
                  className={styles.input}
                  required
                />
              </label>
              {phoneComplete ? (
                matchedCustomer ? (
                  <p className={styles.matchBanner} role="status">
                    <span className={styles.matchBannerIcon} aria-hidden>
                      <MaterialIcon name="check_circle" size={20} />
                    </span>
                    <span>
                      Existing customer:{" "}
                      {getCustomerDisplayName(matchedCustomer, language)}
                    </span>
                  </p>
                ) : (
                  <p className={styles.newBanner} role="status">
                    <MaterialIcon name="person_add" size={20} />
                    <span>New customer — saved when you create the job</span>
                  </p>
                )
              ) : null}
            </section>

            <section
              className={styles.sectionCard}
              aria-labelledby="garment-heading"
            >
              <button
                type="button"
                id="garment-heading"
                className={styles.garmentSectionToggle}
                aria-expanded={garmentPickerOpen}
                aria-controls="garment-picker-panel"
                onClick={() => setGarmentPickerOpen((open) => !open)}
              >
                <span className={styles.sectionTitle}>
                  <span className={styles.sectionTitleIcon} aria-hidden>
                    <MaterialIcon name="checkroom" size={18} />
                  </span>
                  {t("job.wizard.pickGarment")}
                </span>
                <span className={styles.garmentSummary}>
                  {garmentType ? (
                    <>
                      <span className={styles.garmentSummaryEmoji}>
                        {getGarmentEmoji(garmentType)}
                      </span>
                      {resolvedGarmentLabel}
                    </>
                  ) : (
                    <span className={styles.garmentSummaryMuted}>
                      {t("job.wizard.pickGarmentHint")}
                    </span>
                  )}
                </span>
                <MaterialIcon
                  name={garmentPickerOpen ? "expand_less" : "expand_more"}
                  size={24}
                  className={styles.garmentChevron}
                />
              </button>
              <div
                id="garment-picker-panel"
                className={`${styles.garmentPanel} ${garmentPickerOpen ? styles.garmentPanelOpen : styles.garmentPanelCollapsed}`}
                hidden={!garmentPickerOpen}
              >
                <div className={styles.garmentScroll}>
                  <div className={styles.garmentGrid}>
                    {GARMENT_TYPES.map((type) => {
                      const active = garmentType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          className={`${styles.garmentBtn} ${active ? styles.garmentActive : ""}`}
                          onClick={() => {
                            setGarmentType(type);
                            setGarmentLabel(
                              type === "custom"
                                ? ""
                                : getGarmentLabel(type, language)
                            );
                            setGarmentPickerOpen(false);
                          }}
                          aria-pressed={active}
                        >
                          <span className={styles.garmentEmoji}>
                            {getGarmentEmoji(type)}
                          </span>
                          <span>{getGarmentLabel(type, language)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {garmentType ? (
                <div className={styles.garmentNameBlock}>
                  <label className={styles.garmentNameLabel}>
                    <span className={styles.garmentNameTitle}>
                      {garmentType === "custom"
                        ? t("job.wizard.customGarmentName")
                        : t("job.wizard.garmentNameLabel")}
                    </span>
                    {garmentType === "custom" ? (
                      <span className={styles.garmentNameRequired}>
                        {t("job.wizard.customGarmentRequired")}
                      </span>
                    ) : null}
                    <input
                      type="text"
                      className={styles.garmentNameInput}
                      value={garmentLabel}
                      onChange={(e) => setGarmentLabel(e.target.value)}
                      placeholder={
                        garmentType === "custom"
                          ? t("job.wizard.customGarmentPlaceholder")
                          : getGarmentLabel(garmentType, language)
                      }
                      aria-required={garmentType === "custom"}
                    />
                  </label>
                  {garmentType === "custom" ? (
                    <p className={styles.garmentNameHint}>
                      {t("job.wizard.customGarmentHint")}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>

            {garmentType ? (
              <section
                className={`${styles.sectionCard} ${styles.measurementsWrap}`}
                aria-labelledby="measurements-section"
              >
                <h2 id="measurements-section" className={styles.sectionTitle}>
                  <span className={styles.sectionTitleIcon} aria-hidden>
                    <MaterialIcon name="straighten" size={18} />
                  </span>
                  {t("job.wizard.measurements")}
                </h2>
                <MeasurementFields
                  garmentType={garmentType}
                  values={measurements}
                  onChange={(key, value) =>
                    setMeasurements((prev) => ({ ...prev, [key]: value }))
                  }
                />
              </section>
            ) : null}

            <section
              className={styles.sectionCard}
              aria-labelledby="delivery-heading"
            >
              <h2 id="delivery-heading" className={styles.sectionTitle}>
                <span className={styles.sectionTitleIcon} aria-hidden>
                  <MaterialIcon name="event" size={18} />
                </span>
                Delivery &amp; pricing
              </h2>
              <label className={styles.label}>
                <span>{t("job.wizard.deliveryDate")}</span>
                <input
                  type="date"
                  value={promisedAt}
                  min={isoDateOnly(new Date())}
                  onChange={(e) => setPromisedAt(e.target.value)}
                  className={styles.input}
                  required
                />
              </label>
              <div className={styles.row2}>
                <label className={styles.label}>
                  <span>{t("job.wizard.price")} (₹)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={quoted}
                    onChange={(e) => setQuoted(e.target.value)}
                    className={styles.input}
                    placeholder="Quoted"
                  />
                </label>
                <label className={styles.label}>
                  <span>Advance (₹)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={advance}
                    onChange={(e) => setAdvance(e.target.value)}
                    className={styles.input}
                    placeholder="Optional"
                  />
                </label>
              </div>
            </section>

            <section className={styles.sectionCard} aria-labelledby="bill-heading">
              <h2 id="bill-heading" className={styles.sectionTitle}>
                <span className={styles.sectionTitleIcon} aria-hidden>
                  <MaterialIcon name="receipt_long" size={18} />
                </span>
                Bill preview
              </h2>
              <div className={styles.toggleRow}>
                <label className={styles.toggleOption}>
                  <span>Include GST (5%)</span>
                  <input
                    type="checkbox"
                    checked={withGst}
                    onChange={(e) => setWithGst(e.target.checked)}
                  />
                  <span className={styles.toggleSwitch} aria-hidden />
                </label>
                <label className={styles.toggleOption}>
                  <span>Preview sample bill</span>
                  <input
                    type="checkbox"
                    checked={showSampleBill}
                    onChange={(e) => setShowSampleBill(e.target.checked)}
                  />
                  <span className={styles.toggleSwitch} aria-hidden />
                </label>
              </div>

              {displayBill ? (
                <div className={styles.billPreview}>
                  <BillDocument
                    shopName={DEMO_TAILOR.shopName ?? "Ramesh Tailoring Works"}
                    shopPhone="+91 98765 43210"
                    shopAddress="Shop 12, Laxmi Market, Pune — 411001"
                    gstin={withGst ? "27AABCR1234F1Z5" : undefined}
                    billNumber={
                      showSampleBill && !customerName.trim()
                        ? "SAMPLE-001"
                        : `DRAFT-${Date.now().toString(36).slice(-6).toUpperCase()}`
                    }
                    billDate={billDate}
                    customerName={customerName.trim() || "Sample Customer"}
                    customerPhone={
                      phoneComplete ? `+91 ${phoneDigits}` : "+91 98765 43210"
                    }
                    items={billItems}
                    advance={advanceNum}
                    withGst={withGst}
                    gstRate={DUMMY_GST_RATE}
                    isSample={showSampleBill}
                  />
                </div>
              ) : (
                <p className={styles.muted}>
                  Select garment and enter price, or enable sample bill preview.
                </p>
              )}
            </section>

            {formError ? (
              <p className={styles.error} role="alert">
                {formError}
              </p>
            ) : null}
          </div>

          <footer className={styles.stickyFooter}>
            <button
              type="submit"
              disabled={!canSubmit || busy}
              className={styles.saveBtn}
            >
              <MaterialIcon name="save" size={20} />
              {busy ? t("common.loading") : t("common.save")}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

