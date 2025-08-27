import Footer from "@/sharedComponent/Footer";
import AdminNavbar from "./_component/AdminNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto min-h-screen">{children}</main>
      <Footer />
    </section>
  );
}
