import { AppShell } from "@/components/layout";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="volunteer">{children}</AppShell>;
}
