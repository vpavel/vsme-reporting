"use client";
import { useState } from "react";
import Link from "next/link";
import { FaSearch, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import VerdanceLogo from "@/components/ui/VerdanceLogo";
import styles from "./Header.module.css";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Aah, credeai ca: ${searchQuery}? pl, credeai prost`);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logo}>
          <VerdanceLogo size={32} />
        </div>
      </Link>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <FaSearch className={styles.searchIcon} onClick={handleSearch} />
      </div>

      <div className={styles.userMenu}>
        <div className={styles.userInfo} onClick={() => setShowUserMenu(!showUserMenu)}>
          <span className={styles.userName}>{user?.name}</span>
          <FaUserCircle className={styles.profileIcon} />
        </div>

        {showUserMenu && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem}>
              <span>{user?.email}</span>
            </div>
            <div className={styles.dropdownDivider}></div>
            <button className={styles.dropdownButton} onClick={handleLogout}>
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
