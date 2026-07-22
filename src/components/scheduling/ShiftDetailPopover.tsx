export interface ShiftDetailPopoverProps {
  title: string;
  meta: { label: string; value: string }[]; // hours, people on shift, notes…
  actions?: React.ReactNode;
}

export default function ShiftDetailPopover(props: ShiftDetailPopoverProps) {
  return (
    <div
      data-stub="ShiftDetailPopover"
      style={{ border: "1px dashed #bbb", padding: 8 }}
    >
      <div>ShiftDetailPopover · {props.title}</div>
      {props.meta?.map((a) => (
        <span key={a.label}>{a.value} </span>
      ))}
      {props.actions}
    </div>
  );
}
