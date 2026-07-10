export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  footer?: React.ReactNode; // action buttons slot
  children?: React.ReactNode; // body
}
