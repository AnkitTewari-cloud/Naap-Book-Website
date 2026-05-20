"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { NumberInput } from "@/components/ui/NumberInput";
import {
  POC_OTP,
  POC_PHONE_E164,
  POC_PHONE_LOCAL_DIGITS,
} from "@/features/demo/demoCredentials";
import { IS_DEMO_MODE } from "@/features/demo/demoMode";
import { useI18n } from "@/i18n/useI18n";
import { useSendOtpMutation } from "@/store/api/authApi";
import { normalizePhone } from "@/utils/phone";

import styles from "./page.module.css";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setHint(null);

    const norm = normalizePhone(phone);
    if (!/^\+91\d{10}$/.test(norm)) {
      setError("Enter a 10-digit Indian phone number");
      return;
    }

    if (IS_DEMO_MODE && norm === POC_PHONE_E164) {
      const params = new URLSearchParams({
        phone: norm,
        hint: `Demo login: OTP ${POC_OTP}`,
      });
      router.push(`/verify-otp?${params.toString()}`);
      return;
    }

    try {
      const res = await sendOtp({ phone: norm }).unwrap();
      if (res.otpHint) setHint(res.otpHint);
      const params = new URLSearchParams({
        phone: norm,
        ...(res.otpHint ? { hint: res.otpHint } : {}),
      });
      router.push(`/verify-otp?${params.toString()}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { error?: { message?: string } } }).data?.error
                ?.message ?? "Could not send OTP"
            )
          : "Could not send OTP";
      setError(msg);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Header title={t("app.name")} subtitle={t("app.tagline")} />
        <p className={styles.tagline}>{t("auth.phonePrompt")}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <NumberInput
            label={t("auth.phonePrompt")}
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="numeric"
          />
          {hint ? <p className={styles.hint}>{hint}</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? t("common.loading") : t("auth.sendOtp")}
          </Button>
        </form>

        {IS_DEMO_MODE ? (
          <p className={styles.pocNote}>
            Demo: phone <strong>{POC_PHONE_LOCAL_DIGITS}</strong>, OTP{" "}
            <strong>{POC_OTP}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
}
