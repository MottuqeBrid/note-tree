import Link from "next/link";

export default function Logo() {
  return (
    <div className="logo">
      <Link href="/">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Note Tree
        </h1>
      </Link>
    </div>
  );
}
