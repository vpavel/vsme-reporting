"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Add the spin animation to global styles only on the client side
    if (typeof document !== "undefined" && !document.getElementById("spin-animation")) {
      const style = document.createElement("style");
      style.id = "spin-animation";
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        setShouldRedirect(true);
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, isLoading, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
        }}
      >
        <div
          style={{
            padding: "2rem",
            background: "white",
            borderRadius: "1rem",
            boxShadow: "0 20px 50px rgba(16, 185, 129, 0.15)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #d1fae5",
              borderTop: "4px solid #10b981",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p style={{ color: "#065f46", margin: 0 }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated and redirecting
  if (!user && shouldRedirect) {
    return null;
  }

  // Show nothing if user is authenticated but still on login page (will redirect)
  if (user && pathname === "/login") {
    return null;
  }

  // Show protected content if authenticated
  if (user) {
    return <>{children}</>;
  }

  // If we get here, something went wrong
  return null;
}
