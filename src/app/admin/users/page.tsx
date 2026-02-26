// TODO: List all users in a table with name, email, role, and committee columns.
//       Allow admins to edit a user's role and committee via an inline form or modal.
//       Fetch from GET /api/users and update via PUT /api/users/[id].

export default function UsersPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Users</h1>
      <p className="text-gray-500 text-sm">
        TODO: Display a table of all registered users. Allow admins to change a
        user&apos;s role (VOLUNTEER / ADMIN) and committee assignment.
      </p>
    </div>
  );
}
