"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useI18n } from "@/i18n/useI18n";
import { useCreateCustomerMutation } from "@/store/api/customerApi";

import styles from "./new-customer.module.css";

export default function NewCustomerPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [create, { isLoading, error }] = useCreateCustomerMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    try {
      const customer = await create({
        name: trimmedName,
        phone: phone.trim() || undefined,
      }).unwrap();
      router.replace(`/customers/${customer._id}`);
    } catch {
      // error surfaced below
    }
  };

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <Link href="/customers" className={styles.backLink}>
          <MaterialIcon name="arrow_back" size={20} />
          {t("common.back")}
        </Link>

        <h1 className={styles.pageTitle}>{t("customers.add")}</h1>

        <section className={styles.formCard}>
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.label}>
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              <span>Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="+91 …"
                className={styles.input}
              />
            </label>

            {error ? (
              <p className={styles.error}>{t("common.error")}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className={styles.saveBtn}
            >
              {isLoading ? (
                t("common.loading")
              ) : (
                <>
                  <MaterialIcon name="save" size={20} />
                  {t("common.save")}
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
