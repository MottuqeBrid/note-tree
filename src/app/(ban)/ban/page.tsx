import { FaBan } from "react-icons/fa";
import Link from "next/link";

export default function BanPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16">
      <div className="flex flex-col items-center gap-4">
        <FaBan className="text-6xl text-rose-500 mb-2" />
        <h1 className="text-3xl font-bold text-rose-600">Account Banned</h1>
        <p className="text-gray-600 max-w-md mt-2">
          Your account has been banned due to a violation of our terms of
          service. If you believe this is a mistake, please contact support for
          further assistance.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/" className="btn btn-primary w-40 mx-auto">
            Go to Home
          </Link>
          <a
            href="mailto:support@notetree.app"
            className="text-sm text-blue-600 hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
