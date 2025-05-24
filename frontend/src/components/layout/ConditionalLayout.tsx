"use client";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Pages that don't require authentication
  const publicPages = ["/login"];
  const isPublicPage = publicPages.includes(pathname);

  // Don't apply layout to API routes
  const isApiRoute = pathname.startsWith("/api");

  // If it's an API route, don't wrap with any layout
  if (isApiRoute) {
    return <>{children}</>;
  }

  // If it's a public page, render without authentication guard or app layout
  if (isPublicPage) {
    return <>{children}</>;
  }

  // For protected pages, wrap with AuthGuard and AppLayout
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
