"use client";
import type { ReactNode } from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "submitted"
    | "approve" | "approved" | "deny" | "denied"
    | "day" | "day-active" | "day-muted";
  size?: "sm" | "md";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
}

const variants = {
  primary: "bg-brand-blue-muted text-text-on-fill enabled:hover:bg-brand-blue",
  secondary: "bg-white text-brand-blue ring-1 ring-inset ring-brand-blue enabled:hover:bg-surface",
  danger: "bg-deny-border text-white enabled:hover:bg-deny-text",
  ghost: "bg-transparent text-text-body enabled:hover:bg-surface",
  submitted: "bg-brand-blue text-text-on-fill",
  approve: "bg-white text-approve-text ring-1 ring-inset ring-brand-green enabled:hover:bg-approve-hover-fill",
  approved: "bg-approve-fill text-white shadow-approval enabled:hover:bg-approve-hover-fill enabled:hover:text-approve-text enabled:hover:ring-1 enabled:hover:ring-inset enabled:hover:ring-brand-green enabled:hover:shadow-none",
  deny: "bg-white text-deny-text ring-1 ring-inset ring-deny-border enabled:hover:bg-deny-hover-fill",
  denied: "bg-deny-border text-white shadow-approval enabled:hover:bg-deny-hover-fill enabled:hover:text-deny-text enabled:hover:ring-1 enabled:hover:ring-inset enabled:hover:ring-deny-border enabled:hover:shadow-none",
  day: "bg-white text-text-disabled ring-1 ring-inset ring-border enabled:hover:bg-brand-blue-muted enabled:hover:text-white",
  "day-active": "bg-brand-blue text-white font-bold",
  "day-muted": "bg-brand-blue-muted text-white font-bold",
};

const decisions = {
  approve: { label: "Approve", icon: "approve" },
  approved: { label: "Approved", icon: "approve" },
  deny: { label: "Deny", icon: "deny" },
  denied: { label: "Denied", icon: "deny" },
};

/** Callers control decision/day variants and handle save or undo in onClick. */
export default function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const decision = variant in decisions ? decisions[variant as keyof typeof decisions] : undefined;
  const isDay = variant.startsWith("day");
  const decided = variant === "approved" || variant === "denied";
  const sizing = decision
    ? "gap-2 rounded-approval px-[17px] py-[9px] text-sm font-medium leading-5"
    : isDay
      ? "rounded-pill px-3 py-1.5 text-sm leading-[18px]"
      : props.size === "sm"
        ? "gap-2 rounded-full px-5 py-2 text-xs leading-[17px]"
        : "gap-[9px] rounded-control px-6 py-3 text-base font-semibold leading-5";

  return (
    <button type="button"
      className={`group inline-flex shrink-0 items-center justify-center self-center font-sans cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-blue disabled:cursor-not-allowed ${sizing} ${variants[variant]} ${props.fullWidth ? "w-full" : ""} ${variant !== "submitted" ? "disabled:bg-border disabled:text-text-on-fill disabled:shadow-none disabled:ring-0" : ""}`}
      disabled={props.disabled || props.loading || variant === "submitted"}
      aria-busy={props.loading || undefined}
      aria-pressed={isDay ? variant === "day-active" : decision ? decided : undefined}
      aria-label={decided ? `${decision?.label}. Undo ${variant === "approved" ? "approval" : "denial"}` : undefined}
      onClick={props.onClick}>
      {props.leftIcon ?? (decision && (
        <span className="flex size-[15px] shrink-0 items-center justify-center" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/icons/${decision.icon}.svg`} alt=""
            className={decided ? "brightness-0 invert group-enabled:group-hover:hidden" : undefined} />
          {decided && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/icons/undo-${decision.icon}.svg`} alt="" className="hidden group-enabled:group-hover:block" />
          )}
        </span>
      ))}
      <span>{props.loading ? "Loading..." : props.children ?? decision?.label ?? (variant === "submitted" ? "Submitted" : null)}</span>
      {props.rightIcon}
    </button>
  );
}
