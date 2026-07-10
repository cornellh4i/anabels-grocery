import { FieldProps } from "./Fieldprops";

export interface CheckboxProps extends FieldProps<string> {
  options: { label: string; value: string }[];
}
