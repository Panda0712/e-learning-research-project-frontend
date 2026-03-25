import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../apis/auth";
import Loading from "../../components/ui/Loading";

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const { email, token } = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      return;
    }

    authService
      .verifyUserAPI({ email, token })
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        toast.error("Verification failed!");
        setStatus("error");
      });
  }, [email, token]);

  if (status === "loading")
    return <Loading caption="We are verifying your email..." />;

  if (status === "error") return <Navigate to="/auth/login" replace={true} />;

  return <Navigate to={`/auth/login?verifiedEmail=${email}`} replace={true} />;
};

export default VerificationPage;
