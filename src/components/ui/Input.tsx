"use client";
import { useId } from "react";
import type { FieldProps } from "./FieldProps";

export default function Input(props: FieldProps<string>) {
  const id = useId();
  return (
    <div className="flex w-full flex-col gap-2 text-black">
      {props.label && <label htmlFor={id} className="text-base font-semibold leading-5">{props.label}</label>}
      <input id={id} value={props.value} disabled={props.disabled}
        className="h-9 w-full min-w-0 rounded border border-border bg-white px-[9px] py-[7px] text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-disabled aria-invalid:border-deny-text"
        aria-invalid={!!props.error} aria-describedby={props.error ? `${id}-error` : undefined}
        onChange={(event) => props.onChange(event.target.value)} />
      {props.error && <span id={`${id}-error`} className="text-xs leading-[18px] text-deny-text" role="alert">{props.error}</span>}
    </div>
  );
}
