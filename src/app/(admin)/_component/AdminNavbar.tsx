import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="w-full bg-base-100 border-b border-base-300 shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-xl font-bold text-primary">
          Admin Panel
        </Link>
        <ul className="flex gap-3 text-sm">
          <li>
            <Link href="/admin/users" className="hover:text-primary">
              Users
            </Link>
          </li>
          <li>
            <Link href="/admin/covers" className="hover:text-primary">
              Covers
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/" className="btn btn-sm btn-outline">
          Back to App
        </Link>
      </div>
    </nav>
  );
}
