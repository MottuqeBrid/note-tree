import Logo from "@/sharedComponent/Logo";
import Link from "next/link";

export default function TermsNavbar() {
  const navLinks = (
    <>
      <li>
        <Link href="/terms">Terms and Conditions</Link>
      </li>
      <li>
        <Link href="/terms/privacy">Privacy Policy</Link>
      </li>
    </>
  );
  return (
    <div className="bg-base-100 shadow-sm w-full sticky top-0 z-50">
      <nav className="navbar">
        <div className="flex-1">
          <Logo />
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
      </nav>
    </div>
  );
}
