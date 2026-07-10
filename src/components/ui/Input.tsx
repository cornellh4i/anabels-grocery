"use client";

export interface FieldProps<T> {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  error?: string;
  disabled?: boolean;
}

export default function Input(props: FieldProps<string>) {
  return (
    <label
      data-stub="Input"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        color: "#000",
        fontFamily: "Poppins, sans-serif",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 300,
        lineHeight: "normal",
      }}
    >
      {props.label && <span>{props.label}</span>}

      <input
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
        }}
      />

      {props.error && (
        <span style={{ color: "red" }}>
          {props.error}
        </span>
      )}
    </label>
  );
}