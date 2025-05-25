import React, { useState, useEffect } from "react";
import { adminApi, User, Permission, Role } from "../../services/adminApi";
import styles from "./UserPermissionModal.module.css";

interface UserPermissionModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const UserPermissionModal: React.FC<UserPermissionModalProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState<Role>(Role.USER);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // Load available permissions and roles
  useEffect(() => {
    const loadPermissionsAndRoles = async () => {
      try {
        const data = await adminApi.getPermissionsAndRoles();
        setAvailablePermissions(data.permissions);
        setAvailableRoles(data.roles);
      } catch (err) {
        console.error("Failed to load permissions and roles:", err);
      }
    };

    if (isOpen) {
      loadPermissionsAndRoles();
    }
  }, [isOpen]);

  // Set initial values when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setSelectedPermissions([...user.permissions]);
      setError(null);
    }
  }, [user]);

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);

    // Auto-set permissions based on role
    switch (role) {
      case Role.ADMIN:
        setSelectedPermissions([...availablePermissions]);
        break;
      case Role.EDITOR:
        setSelectedPermissions([Permission.EDIT_CONTENT, Permission.READ_USERS]);
        break;
      case Role.USER:
        setSelectedPermissions([]);
        break;
    }
  };

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await adminApi.updateUserPermissions({
        userId: user.id,
        permissions: selectedPermissions,
        role: selectedRole,
      });

      onUpdate();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  const getPermissionDescription = (permission: Permission): string => {
    switch (permission) {
      case Permission.READ_USERS:
        return "View user information and lists";
      case Permission.WRITE_USERS:
        return "Create and edit user accounts";
      case Permission.DELETE_USERS:
        return "Delete user accounts";
      case Permission.EDIT_CONTENT:
        return "Create and modify content";
      case Permission.MANAGE_PERMISSIONS:
        return "Manage user roles and permissions";
      case Permission.ADMIN_ACCESS:
        return "Access admin dashboard and system settings";
      default:
        return String(permission).replace(/_/g, " ").toLowerCase();
    }
  };

  const formatPermissionName = (permission: Permission): string => {
    return permission
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (!isOpen || !user) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit User Permissions</h2>
          <button onClick={handleClose} className={styles.closeButton} disabled={loading}>
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* User Info */}
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <span className={styles.userInitial}>{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className={styles.userDetails}>
              <h3 className={styles.userName}>{user.name}</h3>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Role Selection */}
            <div className={styles.section}>
              <label className={styles.sectionTitle}>Role</label>
              <div className={styles.roleGrid}>
                {availableRoles.map((role) => (
                  <label key={role} className={styles.roleOption}>
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={() => handleRoleChange(role)}
                      disabled={loading}
                      className={styles.roleInput}
                    />
                    <div className={styles.roleCard}>
                      <span className={styles.roleName}>{role}</span>
                      <span className={styles.roleDescription}>
                        {role === Role.ADMIN && "Full system access"}
                        {role === Role.EDITOR && "Content management access"}
                        {role === Role.USER && "Basic user access"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Permission Selection */}
            <div className={styles.section}>
              <label className={styles.sectionTitle}>Individual Permissions</label>
              <p className={styles.sectionDescription}>
                Select specific permissions. Note: Admin role automatically grants all permissions.
              </p>

              <div className={styles.permissionGrid}>
                {availablePermissions.map((permission) => (
                  <label key={permission} className={styles.permissionOption}>
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission) || selectedRole === Role.ADMIN}
                      onChange={() => handlePermissionToggle(permission)}
                      disabled={loading || selectedRole === Role.ADMIN}
                      className={styles.permissionInput}
                    />
                    <div className={styles.permissionCard}>
                      <span className={styles.permissionName}>{formatPermissionName(permission)}</span>
                      <span className={styles.permissionDescription}>{getPermissionDescription(permission)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button type="button" onClick={handleClose} disabled={loading} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className={styles.saveButton}>
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
