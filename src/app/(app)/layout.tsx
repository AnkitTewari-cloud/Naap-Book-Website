import type { ReactNode } from "react";

import { AppShell } from "@/components/AppShell";
import { DemoBanner } from "@/components/DemoBanner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <AppShell>{children}</AppShell>
    </>
  );
}
