import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { couponService, type CouponListItem } from "../../apis/coupon";
import { courseService } from "../../apis/course";
import { orderService } from "../../apis/order";
import { payosService } from "../../apis/payos";
import Button from "../../components/ui/Button";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";

interface ApiCourse {
  id: number;
  name: string;
  price: number;
  category?: {
    id?: number;
    name?: string;
  };
  lecturerName?: string;
  lecturer?: {
    firstName?: string;
    lastName?: string;
  };
  thumbnail?: {
    fileUrl?: string;
  };
}

const Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useAppSelector(selectCurrentUser);

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] =
    useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<CouponListItem[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = (await courseService.getCourseByIdAPI(
          Number(id),
        )) as ApiCourse;
        setCourse(response);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to load course",
          );
        }
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchApplicableCoupons = async () => {
      if (!course?.id) return;

      try {
        setIsLoadingCoupons(true);
        const response = await couponService.getCouponsAPI({
          page: 1,
          itemsPerPage: 200,
          status: "active",
        });

        const rows = Array.isArray(response?.data) ? response.data : [];
        const now = new Date();
        const coursePrice = Number(course.price || 0);
        const courseCategoryId = Number(course?.category?.id || 0);

        const estimateDiscount = (coupon: CouponListItem) => {
          const discountUnit = coupon.discountUnit || "percent";
          const rawDiscount = Number(coupon.discount ?? coupon.amount ?? 0);
          let computed =
            discountUnit === "percent"
              ? (coursePrice * rawDiscount) / 100
              : rawDiscount;

          if (coupon.maxValue !== null && coupon.maxValue !== undefined) {
            computed = Math.min(computed, Number(coupon.maxValue));
          }

          return Number(Math.max(0, computed).toFixed(2));
        };

        const isEligibleByScope = (coupon: CouponListItem) => {
          const scope = coupon.scope || "ALL_COURSES";

          if (scope === "SPECIFIC_COURSE") {
            return Number(coupon.courseId || 0) === Number(course.id);
          }

          if (scope === "CATEGORY") {
            return (
              courseCategoryId > 0 &&
              Number(coupon.scopeCategoryId || 0) === courseCategoryId
            );
          }

          return true;
        };

        const filtered = rows
          .filter((coupon) => {
            const startAt = coupon.startingDate
              ? new Date(coupon.startingDate)
              : null;
            const endAt = coupon.endingDate ? new Date(coupon.endingDate) : null;

            if (startAt && !Number.isNaN(startAt.getTime()) && startAt > now) {
              return false;
            }

            if (endAt && !Number.isNaN(endAt.getTime()) && endAt <= now) {
              return false;
            }

            if (
              coupon.minOrderValue !== null &&
              coupon.minOrderValue !== undefined &&
              coursePrice < Number(coupon.minOrderValue)
            ) {
              return false;
            }

            if (
              coupon.remainingUsages !== null &&
              coupon.remainingUsages !== undefined &&
              Number(coupon.remainingUsages) <= 0
            ) {
              return false;
            }

            return isEligibleByScope(coupon);
          })
          .sort((a, b) => estimateDiscount(b) - estimateDiscount(a));

        setAvailableCoupons(filtered);
      } catch (error) {
        setAvailableCoupons([]);
      } finally {
        setIsLoadingCoupons(false);
      }
    };

    fetchApplicableCoupons();
  }, [course]);

  const applyCouponByCode = async (rawCode: string) => {
    if (!id || !course) return;

    const normalizedCode = rawCode.trim().toUpperCase();
    if (!normalizedCode) {
      toast.error("Please enter coupon code.");
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const result = await couponService.previewCouponAPI({
        code: normalizedCode,
        courseIds: [Number(id)],
      });

      setCouponCode(normalizedCode);
      setCouponDiscount(Number(result.discountAmount || 0));
      setAppliedCouponCode(normalizedCode);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      setCouponDiscount(0);
      setAppliedCouponCode(null);

      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || error.message || "Invalid coupon code",
        );
      } else {
        toast.error("Invalid coupon code");
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePayWithPayOS = async () => {
    if (!id || !currentUser?.id || !course) {
      toast.error("Missing payment data");
      return;
    }

    try {
      setIsCreatingPayment(true);

      const order = await orderService.createOrderAPI({
        studentId: Number(currentUser.id),
        paymentMethod: "PAYOS",
        couponCode: appliedCouponCode || undefined,
        items: [
          {
            courseId: Number(id),
            quantity: 1,
            price: Number(course?.price || 0),
          },
        ],
      });

      const orderId = Number(order?.id);
      if (!orderId) {
        throw new Error("Failed to create order");
      }

      localStorage.setItem("latestPaymentCourseId", String(id));
      localStorage.setItem("latestPaymentOrderId", String(orderId));

      const payment = await payosService.createPaymentLinkAPI(orderId);
      const checkoutUrl = payment?.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("No checkout url returned from PayOS");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to create payment",
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleApplyCoupon = async () => {
    await applyCouponByCode(couponCode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading payment data...
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-20">Course not found</div>;
  }

  const thumbnail = course?.thumbnail?.fileUrl || "";
  const lecturer =
    course?.lecturerName ||
    `${course?.lecturer?.firstName || ""} ${course?.lecturer?.lastName || ""}`.trim();
  const coursePrice = Number(course.price || 0);
  const finalTotal = Math.max(0, coursePrice - couponDiscount);

  const estimateDiscountText = (coupon: CouponListItem) => {
    const discountUnit = coupon.discountUnit || "percent";
    const rawDiscount = Number(coupon.discount ?? coupon.amount ?? 0);
    let computed =
      discountUnit === "percent"
        ? (coursePrice * rawDiscount) / 100
        : rawDiscount;

    if (coupon.maxValue !== null && coupon.maxValue !== undefined) {
      computed = Math.min(computed, Number(coupon.maxValue));
    }

    return `$${Math.max(0, computed).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFC] py-12 px-4 font-poppins">
      <div className="max-w-4xl mx-auto mb-8 text-sm text-gray-500">
        Home &gt; Course &gt; Payment &gt;{" "}
        <span className="text-[#07152F] font-bold">{course.name}</span>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold text-[#07152F] mb-6">
          Pay Course with PayOS
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={thumbnail}
            alt={course.name}
            className="w-full md:w-64 h-40 rounded-xl object-cover bg-gray-100"
          />

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {course.name}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Lecturer: {lecturer || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Payment method:{" "}
              <span className="font-semibold text-[#07152F]">PayOS</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setAppliedCouponCode(null);
                    setCouponDiscount(0);
                  }}
                  placeholder="Enter voucher code"
                  className="flex-1 h-10 px-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                />
                <Button
                  content={isApplyingCoupon ? "Applying..." : "Apply"}
                  onClick={handleApplyCoupon}
                  additionalClass="!w-auto !px-4 !py-2 !h-10 !font-semibold"
                />
              </div>
              {appliedCouponCode && (
                <p className="text-xs text-green-600 mt-2">
                  Applied: {appliedCouponCode}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Available vouchers for this course
                </h3>
                {isLoadingCoupons ? (
                  <span className="text-xs text-gray-500">Loading...</span>
                ) : (
                  <span className="text-xs text-gray-500">
                    {availableCoupons.length} voucher(s)
                  </span>
                )}
              </div>

              {availableCoupons.length > 0 ? (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {availableCoupons.map((voucher) => (
                    <div
                      key={voucher.id}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#07152F]">
                            {voucher.code}
                          </p>
                          <p className="text-xs text-gray-600">
                            {voucher.name} • Save about {estimateDiscountText(voucher)}
                          </p>
                          {voucher.minOrderValue ? (
                            <p className="text-[11px] text-gray-500 mt-1">
                              Min order: ${Number(voucher.minOrderValue).toFixed(2)}
                            </p>
                          ) : null}
                        </div>
                        <Button
                          content={
                            appliedCouponCode === voucher.code
                              ? "Applied"
                              : "Use"
                          }
                          onClick={() => applyCouponByCode(voucher.code)}
                          additionalClass="!w-auto !px-3 !py-1.5 !h-auto !text-xs !font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  No suitable vouchers found for this course at the moment.
                </p>
              )}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Course Price</span>
                <span>${coursePrice.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Amount to Pay</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#07152F]">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                content={
                  isCreatingPayment
                    ? "Creating payment..."
                    : "Continue to PayOS"
                }
                onClick={handlePayWithPayOS}
                additionalClass="!w-auto !px-5 !py-2.5 !h-auto !bg-[#2580D5] !text-white !font-semibold hover:!bg-blue-700"
              />

              <Button
                content="Back"
                type="cancel"
                onClick={() => navigate(-1)}
                additionalClass="!w-auto !px-5 !py-2.5 !h-auto !font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
