
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      <Sidebar />

      <main className="min-h-screen md:pl-20 lg:pl-64">
        {children}
      </main>
    </div>
  );
}
