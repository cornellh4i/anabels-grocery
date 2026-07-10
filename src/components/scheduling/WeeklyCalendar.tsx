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

export default function WeeklyCalendar(props: WeeklyCalendarProps) {
  return (
    <div
      data-stub="WeeklyCalendar"
      style={{ border: "1px dashed #bbb", padding: 8 }}
    >
      <div>WeeklyCalendar · week of {props.weekStart.toDateString()}</div>
      {props.children}
    </div>
  );
}
