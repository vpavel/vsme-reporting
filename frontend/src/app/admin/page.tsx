"use client";
import React, { useState } from "react";
import { useAuth, Permission, Role } from "../../contexts/AuthContext";
import styles from "./AdminDashboard.module.css";
import { UserManagement } from "../../components/UserManagement";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "settings">("users");

  console.log("Current user in admin page:", user);
  console.log("User role:", user?.role);
  console.log("User permissions:", user?.permissions);
  console.log("Has ADMIN_ACCESS:", hasPermission(Permission.ADMIN_ACCESS));
  // Check if user has admin access
  if (!user || !hasPermission(Permission.ADMIN_ACCESS)) {
    return (
      <div className={styles.accessDenied}>
        <div className={styles.accessDeniedContent}>
          <div className={styles.accessDeniedIcon}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className={styles.accessDeniedTitle}>Access Denied</h3>
          <p className={styles.accessDeniedText}>You don&apos;t have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInner}>
            <div className={styles.headerFlex}>
              <div className={styles.titleSection}>
                <div>
                  <h1 className={styles.title}>Admin Dashboard</h1>
                  <dl className={styles.userInfo}>
                    <dt className="sr-only">Role</dt>
                    <dd className={styles.roleInfo}>
                      <svg className={styles.roleIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {user.role}
                    </dd>
                    <dt className="sr-only">Account</dt>
                    <dd className={styles.emailInfo}>
                      <svg className={styles.emailIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {user.email}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <div className={styles.navContent}>
          <nav className={styles.navTabs}>
            <button
              onClick={() => setActiveTab("users")}
              className={`${styles.navTab} ${activeTab === "users" ? styles.navTabActive : styles.navTabInactive}`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`${styles.navTab} ${activeTab === "settings" ? styles.navTabActive : styles.navTabInactive}`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {activeTab === "users" && <UserManagement />}
          {activeTab === "settings" && (
            <div className={styles.settingsPanel}>
              <h3 className={styles.settingsTitle}>System Settings</h3>
              <p className={styles.settingsText}>Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
