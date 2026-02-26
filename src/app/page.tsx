import Link from 'next/link';

const adminLinks = [
  {
    href: '/admin/time-blocks',
    label: 'Time Blocks',
    description: 'Define named shift windows (e.g. Morning 9–11am)',
  },
  {
    href: '/admin/users',
    label: 'Users',
    description: 'View and manage volunteer and admin accounts',
  },
  {
    href: '/admin/shifts',
    label: 'Shifts',
    description: 'Create and schedule shifts by date and time block',
  },
  {
    href: '/admin/shift-assignments',
    label: 'Shift Assignments',
    description: 'Assign volunteers to shifts',
  },
  {
    href: '/admin/swap-requests',
    label: 'Swap Requests',
    description: 'Review open and fulfilled swap requests',
  },
  {
    href: '/admin/swap-fulfillments',
    label: 'Swap Fulfillments',
    description: 'Approve volunteers covering swapped shifts',
  },
  {
    href: '/admin/attendance',
    label: 'Attendance',
    description: 'Mark and review volunteer attendance',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Anabel&apos;s Grocery
      </h1>
      <p className="text-gray-500 mb-8">
        Shift management dashboard for store administrators.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div>
              <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
              <p className="text-gray-500 text-sm mt-0.5">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
