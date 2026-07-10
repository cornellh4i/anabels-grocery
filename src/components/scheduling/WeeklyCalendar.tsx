export interface WeeklyCalendarProps {
  weekStart: Date;
  onWeekChange: (nextWeekStart: Date) => void; // powers ◄ / ► / Today
  onToggleView?: (view: "week") => void; // Week toggle (future views)
  renderCell?: (
    day: Date,
    timeBlock: { start: string; end: string },
  ) => React.ReactNode;
  children?: React.ReactNode;
}
