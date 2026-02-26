import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Anabel's Grocery",
  description: "Shift management for the Anabel's Grocery student-run store",
};

const navLinks = [
  { href: '/admin/time-blocks', label: 'Time Blocks' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/shifts', label: 'Shifts' },
  { href: '/admin/shift-assignments', label: 'Shift Assignments' },
  { href: '/admin/swap-requests', label: 'Swap Requests' },
  { href: '/admin/swap-fulfillments', label: 'Swap Fulfillments' },
  { href: '/admin/attendance', label: 'Attendance' },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 bg-gray-900 text-white flex flex-col">
            <Link
              href="/"
              className="px-5 py-4 font-bold text-base border-b border-gray-700 hover:bg-gray-800 transition-colors"
            >
              Anabel&apos;s Grocery
            </Link>

            <nav className="flex-1 px-3 py-4">
              <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Admin
              </p>
              <ul className="space-y-0.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 bg-gray-50 p-8 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
