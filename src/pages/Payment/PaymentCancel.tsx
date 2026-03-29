import { AxiosError } from "axios";
import { Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { payosService } from "../../apis/payos";
import Button from "../../components/ui/Button";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelPayment = async () => {
      try {
        setIsLoading(true);

        const orderCode =
          searchParams.get("orderCode") ||
          searchParams.get("orderId") ||
          localStorage.getItem("latestPaymentOrderId") ||
          "";

        const parsedOrderId = Number(orderCode);
        if (!parsedOrderId) return;

        await payosService.cancelPaymentAPI(parsedOrderId);
      } catch (error) {
        if (error instanceof AxiosError) {
          const msg =
            error.response?.data?.message ||
            error.message ||
            "Failed to cancel payment";

          // Ignore conflict case when order is already paid.
          if (!msg.toLowerCase().includes("paid")) {
            toast.error(msg);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    cancelPayment();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Updating payment status...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFC] py-12 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-[#07152F] mb-2">
          Payment Cancelled
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          You cancelled the payment. Your order was not completed.
        </p>

        <div className="flex justify-center gap-3">
          <Button
            content="Back to Course"
            onClick={() => navigate(-1)}
            additionalClass="!w-auto !px-5 !py-2.5 !h-auto !bg-[#2580D5] !text-white !font-semibold hover:!bg-blue-700"
          />
          <Button
            content="Go to Courses"
            type="cancel"
            onClick={() => navigate("/courses")}
            additionalClass="!w-auto !px-5 !py-2.5 !h-auto !font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
