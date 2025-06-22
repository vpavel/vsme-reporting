"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SideMenu.module.css";
import { FaInfoCircle, FaLeaf, FaUsers, FaShieldAlt, FaChevronRight } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    href: "/reporting/general-information",
    label: "General Information",
    icon: FaInfoCircle,
    description: "Basic company details",
  },
  {
    href: "/reporting/environmental",
    label: "Environmental",
    icon: FaLeaf,
    description: "Environmental impact & sustainability",
  },
  {
    href: "/reporting/social",
    label: "Social",
    icon: FaUsers,
    description: "Social responsibility & workforce",
  },
  {
    href: "/reporting/governance",
    label: "Governance",
    icon: FaShieldAlt,
    description: "Corporate governance & compliance",
  },
];

export default function SideMenu() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const auth = useAuth();

  const handleDownloadPDF = async () => {
    if (!auth.user?.id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pdf/general-info/${auth.user.id}?companyName=${encodeURIComponent(auth.user.name || "Your Company")}&reportingYear=${new Date().getFullYear()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // If auth is needed
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VSME-Report-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Show error message to user
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* Menu Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>VSME Reporting</h2>
        <p className={styles.subtitle}>Complete your sustainability report</p>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isHovered = hoveredItem === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${isActive ? styles.active : ""} ${isHovered ? styles.hovered : ""}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={styles.menuContent}>
                    <div className={styles.menuLeft}>
                      <div className={`${styles.iconContainer} ${isActive ? styles.iconActive : ""}`}>
                        <Icon className={styles.icon} />
                      </div>
                      <div className={styles.textContent}>
                        <div className={styles.label}>{item.label}</div>
                        <div className={styles.description}>{item.description}</div>
                      </div>
                    </div>

                    <FaChevronRight className={`${styles.arrow} ${isActive ? styles.arrowActive : ""}`} />
                  </div>

                  {isActive && <div className={styles.activeIndicator} />}
                  {isHovered && !isActive && <div className={styles.hoverGlow} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Progress indicator */}
      <div className={styles.progress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressTitle}>Progress</span>
          <span className={styles.progressCount}>0/4</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "0%" }}></div>
        </div>
        <p className={styles.progressText}>Complete all sections to generate your report</p>
      </div>
      <div className={styles.buttonGenerate}>
        <button onClick={handleDownloadPDF} className={styles.menuItem}>
          Download PDF Report
        </button>
      </div>
    </aside>
  );
}
