import { rolePermissions } from "../configs/rbacConfig";

export const usePermission = (userRole: string) => {
  const hasPermission = (permission: string) => {
    const allowedPermissions = rolePermissions[userRole] || [];
    return allowedPermissions.includes(permission);
  };
  return { hasPermission };
};
