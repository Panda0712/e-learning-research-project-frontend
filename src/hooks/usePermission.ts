import { rolePermissions } from "../configs/rbacConfig";

export const usePermission = (userRole: string) => {
  const normalizedRole = String(userRole || "")
    .trim()
    .toLowerCase();

  const hasPermission = (permission: string) => {
    const allowedPermissions =
      rolePermissions[normalizedRole as keyof typeof rolePermissions] || [];
    return allowedPermissions.includes(permission);
  };
  return { hasPermission, normalizedRole };
};
