// TODO: Display attendance records for each shift, showing volunteer name and status
//       (PRESENT, ABSENT, LATE, EXCUSED). Allow filtering by shift date or volunteer.
//       Allow admins to mark/update attendance via POST /api/attendance and
//       PUT /api/attendance/[id].

export default function AttendancePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Attendance</h1>
      <p className="text-gray-500 text-sm">
        TODO: Show attendance records grouped by shift. Allow admins to mark a
        volunteer as present, absent, late, or excused, and add optional notes.
      </p>
    </div>
  );
}
