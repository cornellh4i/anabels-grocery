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
