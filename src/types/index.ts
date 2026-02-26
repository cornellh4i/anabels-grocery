// TypeScript types mirroring every Prisma model in prisma/schema.prisma.
// Dates are typed as Date (Prisma) — JSON responses will serialize them as ISO strings.

export type Role = 'VOLUNTEER' | 'ADMIN';

export type SwapStatus = 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface User {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface TimeBlock {
  id: string;
  /** Human-readable label, e.g. "Morning" */
  name: string;
  /** 24-hour format "HH:MM", e.g. "09:00" */
  startTime: string;
  /** 24-hour format "HH:MM", e.g. "11:00" */
  endTime: string;
  createdAt: Date;
}

export interface Shift {
  id: string;
  date: Date;
  timeBlockId: string;
  userId: string;
  createdAt: Date;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  shiftId: string;
  /** Which time block of the shift is being offered */
  timeBlockId: string;
  status: SwapStatus;
  reason: string | null;
  createdAt: Date;
}

export interface SwapFulfillment {
  id: string;
  swapRequestId: string;
  volunteerId: string;
  /** Which time block the volunteer is covering */
  timeBlockId: string;
  approvedBy: string | null;
  approvedAt: Date | null;
  createdAt: Date;
}

export interface Attendance {
  id: string;
  userId: string;
  shiftId: string;
  status: AttendanceStatus;
  notes: string | null;
  /** ID of the admin who marked attendance */
  markedBy: string | null;
  createdAt: Date;
}
