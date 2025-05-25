"use client";
import React, { useState, useEffect } from "react";
import { adminApi, User, Role } from "../../services/adminApi";
import styles from "./UserManagement.module.css";
import { UserPermissionModal } from "./UserPermissionModal";

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAllUsers(page, 10);
      setUsers(response.users);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(page);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string) => {
    try {
      await adminApi.toggleUserStatus(userId);
      await fetchUsers(currentPage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user status");
      console.error("Error toggling user status:", err);
    }
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePermissionsUpdate = async () => {
    await fetchUsers(currentPage);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return styles.roleAdmin;
      case Role.EDITOR:
        return styles.roleEditor;
      case Role.USER:
        return styles.roleUser;
      default:
        return styles.roleUser;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchUsers(page);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>User Management</h3>
          <p className={styles.subtitle}>Manage user permissions and roles across your application.</p>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <div className={styles.searchIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <div className={styles.errorContent}>
            <p className={styles.errorText}>{error}</p>
            <button onClick={() => setError(null)} className={styles.errorClose}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeader}>User</th>
              <th className={styles.tableHeader}>Role</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Permissions</th>
              <th className={styles.tableHeader}>Joined</th>
              <th className={styles.tableHeader}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredUsers.map((user) => (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      <span className={styles.userInitial}>{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className={styles.userDetails}>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                </td>
                <td className={styles.tableCell}>
                  <span
                    className={`${styles.statusBadge} ${user.isActive ? styles.statusActive : styles.statusInactive}`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.permissionCount}>{user.permissions.length} permissions</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.dateText}>{formatDate(user.createdAt)}</span>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleEditPermissions(user)}
                      className={styles.editButton}
                      title="Edit Permissions"
                    >
                      <svg className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`${styles.toggleButton} ${user.isActive ? styles.toggleDeactivate : styles.toggleActivate}`}
                      title={user.isActive ? "Deactivate User" : "Activate User"}
                    >
                      <svg className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {user.isActive ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>

          <div className={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
      <UserPermissionModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handlePermissionsUpdate}
      />
    </div>
  );
};
