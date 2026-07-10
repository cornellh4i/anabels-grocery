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
