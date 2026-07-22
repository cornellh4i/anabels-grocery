export interface ShiftAssignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ShiftCardProps {
  committee: string;
  time: string; // e.g. "9 a.m. – 11 a.m."
  filled: number; // assignments.length
  capacity: number;
  variant?: "normal" | "low-staffed" | "open-hours";
  assignees?: ShiftAssignee[]; // avatar-chip mode (manager)
  maxAvatars?: number; // overflow → "+N"
  action?: React.ReactNode; // e.g. Join / Drop / Cover button (employee)
  onClick?: () => void;
}

export default function ShiftCard(props: ShiftCardProps) {
  return (
    <div
      data-stub="ShiftCard"
      style={{ border: "1px dashed #bbb", padding: 8 }}
    >
      <div>
        ShiftCard · {props.committee} · {props.time} · {props.filled}/
        {props.capacity}
      </div>
      {props.assignees?.slice(0, props.maxAvatars ?? 3).map((a) => (
        <span key={a.id}>{a.name} </span>
      ))}
      {props.action}
    </div>
  );
}
