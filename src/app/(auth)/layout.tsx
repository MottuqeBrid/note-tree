import Footer from "@/sharedComponent/Footer";
import AuthNavbar from "./_authComponent/AuthNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full">
      <AuthNavbar />
      <main className="max-w-7xl mx-auto min-h-screen">{children}</main>
      <Footer />
    </section>
  );
}
