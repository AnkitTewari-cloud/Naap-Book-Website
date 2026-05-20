"use client";

import type { InputHTMLAttributes, Ref } from "react";

import styles from "./NumberInput.module.css";

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string | null;
  inputRef?: Ref<HTMLInputElement>;
}

export function NumberInput({
  label,
  error,
  className = "",
  inputRef,
  ...rest
}: NumberInputProps) {
  return (
    <label className={styles.wrap}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        className={[styles.input, className].filter(Boolean).join(" ")}
        {...rest}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
    </label>
  );
}

export interface OtpInputProps {
  length: number;
  value: string[];
  onChange: (index: number, digit: string) => void;
  inputRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>;
  error?: string | null;
}

export function OtpInput({
  length,
  value,
  onChange,
  inputRefs,
  error,
}: OtpInputProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.otpRow} role="group" aria-label="OTP digits">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              if (inputRefs) inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            className={styles.otpCell}
            value={value[i] ?? ""}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Backspace" &&
                !value[i] &&
                i > 0 &&
                inputRefs?.current[i - 1]
              ) {
                inputRefs.current[i - 1]?.focus();
              }
            }}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
