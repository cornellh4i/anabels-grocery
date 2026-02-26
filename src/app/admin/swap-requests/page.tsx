// TODO: List all swap requests with requester name, shift date, status, and reason.
//       Allow filtering by status (OPEN, PARTIALLY_FILLED, FILLED, CANCELLED).
//       Allow admins to update the status of a swap request via PUT /api/swap-requests/[id].

export default function SwapRequestsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Swap Requests</h1>
      <p className="text-gray-500 text-sm">
        TODO: Display all swap requests with their current status. Allow admins
        to update the status (e.g. cancel a request) and view associated swap
        fulfillments.
      </p>
    </div>
  );
}
