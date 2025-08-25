import Logo from "@/sharedComponent/Logo";
import ThemeToggle from "@/sharedComponent/ThemToggle";
import Link from "next/link";

const navLinks = (
  <>
    <li>
      <Link href="/" className="">
        Home
      </Link>
    </li>
    <li>
      <Link href="/terms" className="">
        Terms and Conditions
      </Link>
    </li>
  </>
);

export default function AuthNavbar() {
  return (
    <div className="shadow-sm w-full sticky top-0 z-50 bg-transparent">
      <nav className="navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navLinks}
            </ul>
          </div>
          <Logo />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="navbar-end">
          <div className="flex gap-2">
            <ThemeToggle />
            <Link href="/login" className="btn btn-primary text-neutral">
              Login
            </Link>
            <Link href="/register" className="btn btn-secondary text-neutral">
              Register
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
