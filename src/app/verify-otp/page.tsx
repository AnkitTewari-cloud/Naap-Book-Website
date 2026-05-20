"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  applyTailorPreferences,
  persistAuthSession,
} from "@/components/AppBootstrap";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { OtpInput } from "@/components/ui/NumberInput";
import { DEMO_TAILOR } from "@/features/demo/demoFixtures";
import {
  POC_OTP,
  POC_PHONE_E164,
} from "@/features/demo/demoCredentials";
import { IS_DEMO_MODE } from "@/features/demo/demoMode";
import { useI18n } from "@/i18n/useI18n";
import { useAppDispatch } from "@/store";
import { setAuth } from "@/store/authSlice";
import { useVerifyOtpMutation } from "@/store/api/authApi";
import styles from "./page.module.css";

export default function VerifyOtpPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const phone = searchParams.get("phone") ?? "";
  const hint = searchParams.get("hint") ?? "";

  const boxCount = useMemo(() => (IS_DEMO_MODE ? 4 : 6), []);
  const [digits, setDigits] = useState<string[]>(() => Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setDigits(Array(boxCount).fill(""));
  }, [boxCount]);

  const completeDemoLogin = () => {
    const res = {
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      tailor: DEMO_TAILOR,
    };
    persistAuthSession(res);
    dispatch(setAuth(res));
    applyTailorPreferences(dispatch, res.tailor);
    router.replace("/today");
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const otp = digits.join("");
    if (otp.length !== boxCount) {
      setError(
        boxCount === 4
          ? "Enter the 4-digit test OTP"
          : "Enter the 6-digit OTP"
      );
      return;
    }

    if (!phone) {
      setError("Missing phone — go back and enter your number");
      return;
    }

    if (IS_DEMO_MODE && phone === POC_PHONE_E164 && otp === POC_OTP) {
      completeDemoLogin();
      return;
    }

    try {
      const res = await verifyOtp({ phone, otp }).unwrap();
      persistAuthSession(res);
      dispatch(setAuth(res));
      applyTailorPreferences(dispatch, res.tailor);
      router.replace("/today");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { error?: { message?: string } } }).data?.error
                ?.message ?? "Invalid OTP"
            )
          : "Invalid OTP";
      setError(msg);
    }
  };

  const setDigit = (i: number, val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = cleaned;
      return next;
    });
    if (cleaned && i < boxCount - 1) inputRefs.current[i + 1]?.focus();
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Header
          title={t("auth.verify")}
          subtitle={phone}
          showBack
          onBack={() => router.push("/login")}
        />
        <p className={styles.hint}>{hint || t("auth.otpPrompt")}</p>

        <form className={styles.form} onSubmit={handleVerify}>
          <OtpInput
            length={boxCount}
            value={digits.slice(0, boxCount)}
            onChange={setDigit}
            inputRefs={inputRefs}
            error={error}
          />
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? t("common.loading") : t("auth.verify")}
          </Button>
        </form>
      </div>
    </div>
  );
}
