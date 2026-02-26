// TODO: List all shift assignments showing the volunteer name and shift date/time.
//       Allow admins to assign a user to a shift via POST /api/shift-assignments.
//       Allow removing an assignment via DELETE /api/shift-assignments/[id].
//       Validate that the shift has not exceeded capacity before assigning.

export default function ShiftAssignmentsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Shift Assignments</h1>
      <p className="text-gray-500 text-sm">
        TODO: Show a table of all shift assignments with volunteer and shift info.
        Provide controls to assign a volunteer to a shift or remove an existing
        assignment. Respect shift capacity limits.
      </p>
    </div>
  );
}
