"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

export type ToastKind = "success" | "error" | "info";
export interface ToastApi {
  toast(input: { type: ToastKind; message: string }): void;
}

export interface ToastProps {
  type: ToastKind;
  message: string;
  onDismiss: () => void;
  /** Milliseconds before dismissal; zero keeps the toast until dismissed. */
  duration?: number;
}

const variants: Record<ToastKind, string> = {
  success: "border-brand-green bg-status-green-light text-approve-text",
  error: "border-deny-border bg-status-red-light text-deny-text",
  info: "border-brand-blue bg-white text-brand-blue",
};

const labels: Record<ToastKind, string> = {
  success: "Success",
  error: "Error",
  info: "Info",
};

export default function Toast({ type, message, onDismiss, duration = 5000 }: ToastProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (duration <= 0 || hovered || focused) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, hovered, focused, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-control border p-4 font-sans text-sm leading-5 shadow-card ${variants[type]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="min-w-0 flex-1 break-words" role={type === "error" ? "alert" : "status"} aria-atomic="true">
        <span className="font-semibold">{labels[type]}: </span>{message}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={`Dismiss ${labels[type].toLowerCase()} notification`}
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-lg hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

const ToastContext = createContext<ToastApi | null>(null);

interface ToastEntry {
  id: number;
  type: ToastKind;
  message: string;
}

function ToastItem({ entry, dismiss }: { entry: ToastEntry; dismiss: (id: number) => void }) {
  const onDismiss = useCallback(() => dismiss(entry.id), [dismiss, entry.id]);
  return <Toast type={entry.type} message={entry.message} onDismiss={onDismiss} />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);
  const toast = useCallback<ToastApi["toast"]>((input) => {
    const entry = { ...input, id: nextId.current++ };
    setToasts((current) => [...current, entry]);
  }, []);
  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);
  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section aria-label="Notifications" className="pointer-events-none fixed right-4 bottom-4 left-4 z-[100] flex max-h-[calc(100dvh-2rem)] flex-col gap-3 overflow-y-auto sm:left-auto sm:w-96">
        {toasts.map((entry) => <ToastItem key={entry.id} entry={entry} dismiss={dismiss} />)}
      </section>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider.");
  return context;
}
