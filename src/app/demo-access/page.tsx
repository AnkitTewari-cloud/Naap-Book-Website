"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import styles from "./page.module.css";

export default function DemoAccessPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/demo-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Invalid password");
        return;
      }

      router.replace("/login");
    } catch {
      setError("Could not reach server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Naap Book Demo</h1>
        <p className={styles.hint}>
          डेमो देखने के लिए पासवर्ड डालें।
          <br />
          Enter the demo password to continue.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="password"
            className={styles.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Demo password"
            autoComplete="current-password"
            autoFocus
            required
          />
          {error ? <p className={styles.error}>{error}</p> : null}
          <Button type="submit" fullWidth disabled={loading || !password}>
            {loading ? "Checking…" : "Continue"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
