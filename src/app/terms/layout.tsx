import TermsNavbar from "./TermsNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full">
      <TermsNavbar />
      <main className="max-w-7xl mx-auto min-h-screen">{children}</main>
    </section>
  );
}
