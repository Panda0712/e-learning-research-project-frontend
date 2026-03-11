/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { fetchCurrentUserAPI } from "../../redux/activeUser/activeUserSlice";

const OAuthGoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const oauth = searchParams.get("oauth");

    if (oauth !== "success") {
      toast.error("Google OAuth login failed!");
      navigate("/auth/login", { replace: true });
      return;
    }

    dispatch(fetchCurrentUserAPI())
      .unwrap()
      .then(() => {
        toast.success("Login successfully!");
        navigate("/", { replace: true });
      })
      .catch((error: any) => {
        toast.error(error?.message || "Cannot get current user!");
        navigate("/auth/login", { replace: true });
      });
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  );
};

export default OAuthGoogleCallbackPage;
