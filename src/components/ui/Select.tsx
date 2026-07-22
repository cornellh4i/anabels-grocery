"use client";
import { FieldProps } from "./FieldProps";

export interface SelectProps extends FieldProps<string> {
  options: { label: string; value: string }[];
}

export default function Select(props: SelectProps) {
  return (
    <label
      data-stub="Select"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        fontFamily: "Poppins, sans-serif",
        fontSize: "12px",
        fontWeight: 300,
      }}
    >
      {props.label && <span>{props.label}</span>}

      <select
        value={props.value}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.target.value)}
        style={{
          border: "1px dashed #bbb",
          borderRadius: "8px",
          padding: "8px 10px",
          fontFamily: "Poppins, sans-serif",
          fontSize: "12px",
          fontWeight: 300,
          background: "#fff",
        }}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {props.error && <span style={{ color: "red" }}>{props.error}</span>}
    </label>
  );
}
