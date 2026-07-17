export interface FieldProps<T> {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  error?: string;
  disabled?: boolean;
}
