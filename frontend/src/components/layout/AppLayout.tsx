import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Header />

      {/* Main content area with sidebar */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <SideMenu />

        {/* Main content */}
        <main style={{ flex: 1, padding: "1.5rem", backgroundColor: "#f9fafb" }}>{children}</main>
      </div>
    </div>
  );
}
