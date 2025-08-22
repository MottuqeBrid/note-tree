import Footer from "@/sharedComponent/Footer";
import DashboardNavbar from "./_component/DashboardNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto min-h-screen">{children}</main>
      <Footer />
    </section>
  );
}
