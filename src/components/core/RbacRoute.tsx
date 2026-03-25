import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";
import {
  selectAuthResolved,
  selectCurrentUser,
} from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import Loading from "../ui/Loading";

const RbacRoute = ({
  requiredPermission,
  redirectTo = "/access-denied",
}: {
  requiredPermission: string;
  redirectTo?: string;
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const authResolved = useAppSelector(selectAuthResolved);

  const { hasPermission } = usePermission(currentUser?.role);

  if (!authResolved) return <Loading caption="Checking your session..." />;

  if (!currentUser) return <Navigate to="/auth/login" replace />;

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RbacRoute;
