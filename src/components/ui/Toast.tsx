export type ToastKind = "success" | "error" | "info";
export interface ToastApi {
  toast(input: { type: ToastKind; message: string }): void;
}
