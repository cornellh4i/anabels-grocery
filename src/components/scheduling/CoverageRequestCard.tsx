export interface CoverageRequestCardProps {
  shiftLabel: string;
  reason?: string;
  filled: number;
  capacity: number;
  action?: React.ReactNode;
}

export default function CoverageRequestCard(props: CoverageRequestCardProps) {
  return (
    <div
      data-stub="CoverageRequestCard"
      style={{ border: "1px dashed #bbb", padding: 8 }}
    >
      <div>
        CoverageRequestCard · {props.shiftLabel} · {props.reason} ·{" "}
        {props.filled}/{props.capacity}
      </div>
      {props.action}
    </div>
  );
}
