import { ACCOUNT_ROLES } from "../utils/constants";

export const permissions = {
  VIEW_DASHBOARD_ADMIN: "view_dashboard_admin",
  VIEW_DASHBOARD_LECTURER: "view_dashboard_lecturer",
  VIEW_PROFILE: "view_profile",
  VIEW_COURSE: "view_course",
  VIEW_PAYMENT: "view_payment",
  VIEW_LECTURER: "view_lecturer",
  VIEW_LECTURER_REGISTRATION: "view_lecturer_registration",
};

export const rolePermissions = {
  [ACCOUNT_ROLES.ADMIN]: [permissions.VIEW_DASHBOARD_ADMIN],
  [ACCOUNT_ROLES.STUDENT]: [
    permissions.VIEW_PROFILE,
    permissions.VIEW_COURSE,
    permissions.VIEW_PAYMENT,
    permissions.VIEW_LECTURER,
    permissions.VIEW_LECTURER_REGISTRATION,
  ],
  [ACCOUNT_ROLES.LECTURER]: [
    permissions.VIEW_DASHBOARD_LECTURER,
    permissions.VIEW_LECTURER,
    permissions.VIEW_LECTURER_REGISTRATION,
  ],
};
