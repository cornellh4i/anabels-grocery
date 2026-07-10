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

export default function StatusPill(props: StatusPillProps) {
  return (
    <span
      data-stub="StatusPill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        borderRadius: "999px",
        border: "1px dashed #bbb",
        background: "#f3f3f3",
        color: "#000",
        fontFamily: "Poppins, sans-serif",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 300,
        lineHeight: "normal",
      }}
    >
      {props.children ?? variantLabels[props.variant]}
    </span>
  );
}