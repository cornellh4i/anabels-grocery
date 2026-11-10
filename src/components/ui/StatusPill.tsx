export interface StatusPillProps {
  variant:
    | "completed"
    | "present"
    | "absent"
    | "late"
    | "excused"
    | "low-staffed";
  children?: React.ReactNode;
}

const variantLabels: Record<StatusPillProps["variant"], string> = {
  completed: "Completed",
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
  "low-staffed": "Low staffed",
};

const variants: Record<StatusPillProps["variant"], string> = {
  completed: "bg-status-completed text-black",
  present: "bg-status-green-light text-approve-text",
  absent: "bg-status-red-light text-deny-text",
  late: "bg-surface text-text-body ring-1 ring-inset ring-border",
  excused: "bg-surface text-brand-blue",
  "low-staffed": "bg-status-red-light text-brand-red",
};

export default function StatusPill(props: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap font-sans font-semibold ${props.variant === "low-staffed" ? "rounded-[3px] px-1 py-[3px] text-[8px] leading-[10px]" : "rounded-full px-4 py-2 text-xs leading-[15px]"} ${variants[props.variant]}`}
    >
      {props.children ?? variantLabels[props.variant]}
    </span>
  );
}
