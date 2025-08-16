import Link from "next/link";

export default function Logo() {
  return (
    <div className="logo">
      <Link href="/">
        <h1 className="text-2xl font-bold text-primary">Note Tree</h1>
      </Link>
    </div>
  );
}
