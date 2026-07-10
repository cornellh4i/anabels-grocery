import { FieldProps } from "./Fieldprops";

export interface SelectProps extends FieldProps<string> {
  options: { label: string; value: string }[];
}
