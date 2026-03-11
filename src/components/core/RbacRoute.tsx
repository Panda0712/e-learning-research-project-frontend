import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import { ACCOUNT_ROLES } from "../../utils/constants";

const RbacRoute = ({
  requiredPermission,
  redirectTo = "/access-denied",
}: {
  requiredPermission: string;
  redirectTo?: string;
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserRole = currentUser?.role || ACCOUNT_ROLES.STUDENT;

  const { hasPermission } = usePermission(currentUserRole);

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />;
  }

  return <Outlet />;
};

export default RbacRoute;
