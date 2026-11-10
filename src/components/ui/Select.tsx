"use client";

import { useId } from "react";
import type { FieldProps } from "./FieldProps";

export interface SelectProps extends FieldProps<string> {
  options: { label: string; value: string }[];
}

export default function Select(props: SelectProps) {
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-2 font-sans">
      {props.label && <label htmlFor={id} className="text-sm font-medium leading-5 text-text-label">{props.label}</label>}
      <div className="relative">
        <select
          id={id}
          value={props.value}
          disabled={props.disabled}
          aria-invalid={!!props.error}
          aria-describedby={props.error ? `${id}-error` : undefined}
          onChange={(event) => props.onChange(event.target.value)}
          className="w-full min-w-0 appearance-none rounded-control border border-border bg-white py-3 pr-11 pl-4 text-sm leading-5 text-text-body focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-disabled aria-invalid:border-deny-text"
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <span className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 ${props.disabled ? "opacity-30" : ""}`} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/select-arrow.svg" alt="" />
        </span>
      </div>
      {props.error && <span id={`${id}-error`} role="alert" className="text-xs leading-[18px] text-deny-text">{props.error}</span>}
    </div>
  );
}
