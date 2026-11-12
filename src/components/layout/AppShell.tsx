"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export interface AppShellProps {
  role: "volunteer" | "admin";
  children: React.ReactNode;
}

function NavIcon({ name }: { name: string }) {
  // Preserve the native dimensions of the Figma SVGs.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/navigation/${name}.svg`} alt="" className="shrink-0" />;
}

export default function AppShell({ role, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const home = role === "admin" ? "/admin/shifts" : "/volunteer";
  const name = user?.displayName || user?.email || (role === "admin" ? "Administrator" : "Volunteer");
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut(auth);
      document.cookie = "session=; path=/; max-age=0";
      router.replace("/login");
      router.refresh();
    } catch {
      toast({ type: "error", message: "Could not sign out. Please try again." });
      setSigningOut(false);
    }
  }

  function navLink(href: string, label: string, icon: string) {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link href={href} aria-current={active ? "page" : undefined}
        className={`flex min-h-6 items-center gap-2 rounded text-sm hover:text-brand-blue ${focus} ${active ? "font-semibold text-brand-blue" : "text-black/80"}`}>
        <span className="flex w-[25px] shrink-0 justify-center"><NavIcon name={icon} /></span>
        {label}
      </Link>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white text-text-body md:flex-row">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
      <aside className={`flex shrink-0 flex-col justify-between gap-8 border-b border-[#dcdee7] bg-white px-5 py-6 shadow-[1px_0px_4px_0px_rgba(0,0,0,0.1)] md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0 ${collapsed ? "md:w-[64px] md:px-4" : "md:w-[240px]"}`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3">
            {!collapsed && (
              <Link href={home} className={`shrink-0 ${focus}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/navigation/logo.png" alt="Anabel's Grocery" width={120} height={56} className="h-14 w-[120px] object-cover" />
              </Link>
            )}
            <button type="button" aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              aria-expanded={!collapsed} aria-controls="app-navigation" onClick={() => setCollapsed(!collapsed)}
              className={`flex size-6 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-surface ${focus} ${collapsed ? "rotate-180" : ""}`}>
              <NavIcon name="collapse" />
            </button>
          </div>
          <nav id="app-navigation" aria-label={`${role === "admin" ? "Admin" : "Volunteer"} navigation`} hidden={collapsed}>
            <ul className="space-y-8">
              {role === "admin" ? (
                <li>
                  <button type="button" aria-expanded={calendarOpen} aria-controls="calendar-navigation" onClick={() => setCalendarOpen(!calendarOpen)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded text-sm text-black/80 ${focus}`}>
                    <span className="flex min-h-6 items-center gap-2"><span className="flex w-[25px] shrink-0 justify-center"><NavIcon name="calendar" /></span>Calendar</span>
                    <span className={calendarOpen ? "rotate-90" : "-rotate-90"}><NavIcon name="chevron" /></span>
                  </button>
                  <ul id="calendar-navigation" hidden={!calendarOpen} className="mt-5 space-y-6 pl-5">
                    <li>{navLink("/admin/shifts", "Shift Calendar", "shifts")}</li>
                    {[
                      { label: "Employee Schedule", icon: "users" },
                      { label: "Employee Availability", icon: "availability" },
                    ].map(({ label, icon }) => (
                      <li key={label}>
                        <span aria-disabled="true" title={`${label} is not available yet`} className="flex min-h-6 items-center gap-2 text-sm text-text-label">
                          <span className="flex w-[25px] shrink-0 justify-center"><NavIcon name={icon} /></span>
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <>
                  <li>{navLink(home, "Calendar", "calendar")}</li>
                  <li><span aria-disabled="true" title="Your shift schedule is not available yet" className="flex min-h-6 items-center gap-2 text-sm text-text-label"><span className="flex w-[25px] shrink-0 justify-center"><NavIcon name="schedule" /></span>Your Shift Schedule</span></li>
                </>
              )}
              <li><span aria-disabled="true" title="Notifications are not available yet" className="flex min-h-6 items-center gap-2 text-sm text-text-label"><span className="flex w-[25px] shrink-0 justify-center"><NavIcon name="notifications" /></span>Notifications</span></li>
            </ul>
          </nav>
        </div>
        {!collapsed && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-sm text-black">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="" width={30} height={30} className="size-[30px] shrink-0 rounded-full object-cover" />
              ) : <span aria-hidden="true" className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-surface text-brand-blue">{name.charAt(0).toUpperCase()}</span>}
              <span className="truncate" title={name}>{name}</span>
            </div>
            <Button variant="ghost" size="sm" fullWidth loading={signingOut} onClick={handleSignOut}>Sign out</Button>
          </div>
        )}
      </aside>
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 overflow-x-auto bg-surface p-4 outline-none md:p-8">{children}</main>
    </div>
  );
}
