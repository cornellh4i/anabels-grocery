import { FieldProps } from "./Fieldprops";

export interface CheckboxProps extends FieldProps<string> {
  options: { label: string; value: string }[];
}

export default function Checkbox(props: FieldProps<boolean>) {
  return (
    <label
      data-stub="Checkbox"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "Poppins, sans-serif",
        fontSize: "12px",
        fontWeight: 300,
      }}
    >
      <input
        type="checkbox"
        checked={props.value}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.target.checked)}
      />

      <span>{props.label ?? "Checkbox placeholder"}</span>

      {props.error && <span style={{ color: "red" }}>{props.error}</span>}
    </label>
  );
}