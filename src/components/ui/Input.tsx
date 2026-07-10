import { FieldProps } from "./Fieldprops";

export interface InputProps extends FieldProps<string> {
  options: { label: string; value: string }[];
}
