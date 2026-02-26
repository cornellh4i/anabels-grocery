// TODO: List all swap fulfillments showing the volunteer covering the shift,
//       the original swap request, the time block being covered, and approval status.
//       Allow admins to approve a fulfillment by setting approvedBy and approvedAt
//       via PUT /api/swap-fulfillments/[id].

export default function SwapFulfillmentsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Swap Fulfillments</h1>
      <p className="text-gray-500 text-sm">
        TODO: Show all pending and approved swap fulfillments. Allow admins to
        approve a fulfillment (set approvedBy and approvedAt) or reject it.
      </p>
    </div>
  );
}
