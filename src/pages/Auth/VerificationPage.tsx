import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { authService } from "../../apis/auth";
import Loading from "../../components/ui/Loading";

const VerificationPage = () => {
  const [searchParams] = useSearchParams();

  const { email, token } = Object.fromEntries([...searchParams]);

  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (email && token) {
      authService.verifyUserAPI({ email, token }).then(() => {
        setVerified(true);
      });
    }
  }, [email, token]);

  if (!verified) return <Loading caption="We are verifying your email..." />;

  return <Navigate to={`/auth/login?verifiedEmail=${email}`} />;
};

export default VerificationPage;
