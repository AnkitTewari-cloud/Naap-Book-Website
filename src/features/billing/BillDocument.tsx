"use client";

import { getGarmentLabel } from "@/constants/garments";
import { useI18n } from "@/i18n/useI18n";
import type { GarmentType } from "@/types/shared";

import styles from "./BillDocument.module.css";

export interface BillLineItem {
  description: string;
  garmentType?: GarmentType;
  qty: number;
  rate: number;
}

export interface BillDocumentProps {
  shopName: string;
  shopPhone?: string;
  shopAddress?: string;
  gstin?: string;
  billNumber: string;
  billDate: string;
  customerName: string;
  customerPhone?: string;
  items: BillLineItem[];
  advance?: number;
  withGst: boolean;
  gstRate?: number;
  isSample?: boolean;
  className?: string;
}

export function BillDocument({
  shopName,
  shopPhone,
  shopAddress,
  gstin,
  billNumber,
  billDate,
  customerName,
  customerPhone,
  items,
  advance = 0,
  withGst,
  gstRate = 0.05,
  isSample = false,
  className = "",
}: BillDocumentProps) {
  const { language } = useI18n();
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const gstAmount = withGst ? Math.round(subtotal * gstRate) : 0;
  const total = subtotal + gstAmount;
  const balance = Math.max(0, total - advance);

  return (
    <article
      className={`${styles.bill} ${isSample ? styles.sample : ""} ${className}`.trim()}
      id="bill-document"
    >
      {isSample ? <div className={styles.sampleRibbon}>Sample bill</div> : null}

      <header className={styles.header}>
        <h1 className={styles.shopName}>{shopName}</h1>
        {shopPhone ? <p className={styles.muted}>{shopPhone}</p> : null}
        {shopAddress ? <p className={styles.muted}>{shopAddress}</p> : null}
        {withGst ? (
          <p className={styles.gstin}>
            {gstin ? `GSTIN: ${gstin}` : "GST invoice (5%)"}
          </p>
        ) : (
          <p className={styles.gstin}>Bill without GST</p>
        )}
      </header>

      <div className={styles.meta}>
        <div>
          <span className={styles.metaLabel}>Bill #</span>
          <strong>{billNumber}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Date</span>
          <strong>{billDate}</strong>
        </div>
      </div>

      <div className={styles.customer}>
        <span className={styles.metaLabel}>Customer</span>
        <strong>{customerName}</strong>
        {customerPhone ? (
          <span className={styles.muted}> · {customerPhone}</span>
        ) : null}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.muted}>
                No line items
              </td>
            </tr>
          ) : null}
          {items.map((row, i) => (
            <tr key={i}>
              <td>
                {row.garmentType
                  ? getGarmentLabel(row.garmentType, language)
                  : row.description}
              </td>
              <td>{row.qty}</td>
              <td>₹{row.rate.toLocaleString("en-IN")}</td>
              <td>₹{(row.qty * row.rate).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.totals}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {withGst ? (
          <div className={styles.row}>
            <span>GST ({(gstRate * 100).toFixed(0)}%)</span>
            <span>₹{gstAmount.toLocaleString("en-IN")}</span>
          </div>
        ) : null}
        <div className={`${styles.row} ${styles.total}`}>
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
        {advance > 0 ? (
          <>
            <div className={styles.row}>
              <span>Advance paid</span>
              <span>₹{advance.toLocaleString("en-IN")}</span>
            </div>
            <div className={`${styles.row} ${styles.balance}`}>
              <span>Balance due</span>
              <span>₹{balance.toLocaleString("en-IN")}</span>
            </div>
          </>
        ) : null}
      </div>

      <p className={styles.footer}>Thank you — धन्यवाद</p>
    </article>
  );
}
