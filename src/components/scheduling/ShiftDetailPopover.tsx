export interface ShiftDetailPopoverProps {
  title: string;
  meta: { label: string; value: string }[]; // hours, people on shift, notes…
  actions?: React.ReactNode;
}
