import { AxiosError } from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { payosService } from "../../apis/payos";
import Button from "../../components/ui/Button";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);

        const orderCode =
          searchParams.get("orderCode") ||
          searchParams.get("orderId") ||
          localStorage.getItem("latestPaymentOrderId") ||
          "";

        const parsedOrderId = Number(orderCode);
        if (!parsedOrderId) {
          setIsPaid(false);
          return;
        }

        setOrderId(parsedOrderId);
        const response =
          await payosService.checkPaymentStatusAPI(parsedOrderId);
        const paymentStatus = String(
          response?.data?.paymentStatus || "",
        ).toLowerCase();

        setIsPaid(paymentStatus === "paid");
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to check payment status",
          );
        }
        setIsPaid(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Checking payment status...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFC] py-12 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
        {isPaid ? (
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        )}

        <h1 className="text-2xl font-bold text-[#07152F] mb-2">
          {isPaid ? "Payment Successful" : "Payment Not Completed"}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          {isPaid
            ? `Your order ${orderId ? `#${orderId}` : ""} has been paid successfully.`
            : "Payment has not been confirmed yet. You can retry payment from course page."}
        </p>

        <div className="flex justify-center gap-3">
          <Button
            content="Go to My Learning"
            onClick={() => navigate("/profile/my-courses")}
            additionalClass="!w-auto !px-5 !py-2.5 !h-auto !bg-[#2580D5] !text-white !font-semibold hover:!bg-blue-700"
          />
          <Button
            content="Back to Courses"
            type="cancel"
            onClick={() => navigate("/courses")}
            additionalClass="!w-auto !px-5 !py-2.5 !h-auto !font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
