"use client";

import { useId } from "react";
import type { FieldProps } from "./FieldProps";

export default function Checkbox(props: FieldProps<boolean>) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1 font-sans text-xs font-light leading-[15px] text-text-soft">
      <label htmlFor={id} className={`inline-flex min-h-6 items-center gap-[5px] self-start ${props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
        <span className="relative flex size-2 shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={props.value}
            disabled={props.disabled}
            aria-invalid={!!props.error}
            aria-describedby={props.error ? `${id}-error` : undefined}
            onChange={(event) => props.onChange(event.target.checked)}
            className="peer m-0 size-2 cursor-inherit accent-brand-blue focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-blue aria-invalid:outline aria-invalid:outline-deny-text"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/checkbox.svg" alt="" aria-hidden="true" className="pointer-events-none absolute peer-checked:hidden" />
        </span>
        {props.label && <span>{props.label}</span>}
      </label>
      {props.error && <span id={`${id}-error`} role="alert" className="text-xs leading-[18px] text-deny-text">{props.error}</span>}
    </div>
  );
}
