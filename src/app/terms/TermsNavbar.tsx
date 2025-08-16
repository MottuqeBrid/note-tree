import Logo from "@/sharedComponent/Logo";
import Link from "next/link";

export default function TermsNavbar() {
  return (
    <div className="bg-base-100 shadow-sm w-full sticky top-0 z-50">
      <nav className="navbar">
        <div className="flex justify-between items-center">
          <Logo />
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/terms" className="">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
