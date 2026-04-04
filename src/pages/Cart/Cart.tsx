/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, Loader2, ShoppingCart, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartService } from "../../apis/cart";
import { couponService } from "../../apis/coupon";
import { orderService } from "../../apis/order";
import { payosService } from "../../apis/payos";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import { formatCurrencyVND } from "../../utils/helpers";

const COLORS = {
  yellowBtn: "#FFD900",
};

interface CartItemType {
  id: number;
  courseId: number;
  title: string;
  lecturer: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  thumbnail: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser || !currentUser.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const cartData = await cartService.getCartByUserId(currentUser.id);

        if (cartData && cartData.items) {
          const mappedItems = cartData.items.map((item: any) => ({
            id: item.id,
            courseId: item.courseId,
            title: item.course?.name || "Course",
            lecturer: item.course?.lecturerName || "N/A",
            price: item.price,
            originalPrice: item.price + 20,
            rating: 4.8,
            reviews: 1200,
            thumbnail:
              item.course?.thumbnail?.fileUrl ||
              "https://placehold.co/600x400/2563eb/white?text=EduLearn",
          }));
          setCartItems(mappedItems);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to get cart data!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  const totalOriginalPrice = cartItems.reduce(
    (acc, item) => acc + item.originalPrice,
    0,
  );
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal - appliedDiscount;

  const handleRemoveItem = async (itemId: number) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      await cartService.removeItem(itemId);
      toast.success("Deleted course from cart!");
    } catch (error: any) {
      toast.error(error?.message || "Delete failed! Please try again later!");
    }
  };

  const handleApplyPromo = async () => {
    const normalizedCode = promoCode.trim().toUpperCase();
    if (!normalizedCode) {
      toast.error("Please enter coupon code.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsApplyingPromo(true);
      const preview = await couponService.previewCouponAPI({
        code: normalizedCode,
        courseIds: cartItems.map((item) => Number(item.courseId)),
      });

      const discountAmount = Number(preview?.discountAmount || 0);
      setAppliedCouponCode(normalizedCode);
      setAppliedDiscount(discountAmount);
      setPromoCode(normalizedCode);
      toast.success("Coupon applied successfully!");
    } catch (error: any) {
      setAppliedCouponCode(null);
      setAppliedDiscount(0);
      toast.error(
        error?.response?.data?.message || "Coupon code is not valid!",
      );
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleCheckout = async () => {
    if (!currentUser?.id) {
      toast.error("Please login to checkout.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsCheckingOut(true);

      const order = await orderService.createOrderAPI({
        studentId: Number(currentUser.id),
        paymentMethod: "PAYOS",
        couponCode: appliedCouponCode || undefined,
      });

      const orderId = Number(order?.id);
      if (!orderId) {
        throw new Error("Failed to create order");
      }

      localStorage.setItem("latestPaymentOrderId", String(orderId));

      const payment = await payosService.createPaymentLinkAPI(orderId);
      const checkoutUrl = payment?.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("No checkout URL returned from PayOS");
      }

      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Cannot checkout right now.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_22%,#f7f4ff_100%)] px-4 py-10 font-sans md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/86 p-6 shadow-[0_26px_80px_rgba(34,40,84,0.08)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(112,79,230,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,217,0,0.12),transparent_30%)]" />
          <div className="relative">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#704FE6]">
                    Your basket
                  </span>
                  <h1 className="mt-2 text-3xl font-semibold text-[#163541] md:text-[42px]">
                    Shopping Cart
                  </h1>
                  <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#64748B]">
                    Review your selected courses, apply promotions, and continue
                    to checkout when you&apos;re ready.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:min-w-105">
                  <div className="rounded-3xl border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] px-5 py-4 shadow-[0_14px_34px_rgba(34,40,84,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                      Courses
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#163541]">
                      {cartItems.length}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] px-5 py-4 shadow-[0_14px_34px_rgba(34,40,84,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                      Savings
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#16A34A]">
                      {formatCurrencyVND(
                        totalOriginalPrice - subtotal + appliedDiscount,
                      )}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] px-5 py-4 shadow-[0_14px_34px_rgba(34,40,84,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                      Ready to pay
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#163541]">
                      {formatCurrencyVND(Math.max(0, total))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between rounded-3xl border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#fbfcff_100%)] px-5 py-4 shadow-[0_12px_30px_rgba(34,40,84,0.04)]">
                    <h2 className="text-lg font-semibold text-[#163541]">
                      {cartItems.length} Course{cartItems.length !== 1 && "s"}{" "}
                      in Cart
                    </h2>
                    <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#19566A]">
                      Updated live
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center rounded-[28px] border border-[#E7ECF3] bg-white p-14 text-center shadow-[0_16px_40px_rgba(34,40,84,0.05)]">
                      <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#EEF4FF]">
                        <Loader2
                          className="animate-spin text-[#19566A]"
                          size={32}
                        />
                      </div>
                      <p className="text-lg font-semibold text-[#163541]">
                        Loading your cart...
                      </p>
                      <p className="mt-2 text-sm text-[#64748B]">
                        Preparing your selected courses.
                      </p>
                    </div>
                  ) : cartItems.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="group flex flex-col gap-4 rounded-[28px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#fbfcff_100%)] p-4 shadow-[0_16px_42px_rgba(34,40,84,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(34,40,84,0.08)] sm:flex-row sm:items-center sm:p-5"
                        >
                          <div className="h-28 w-full shrink-0 overflow-hidden rounded-[22px] bg-[#E8EEF5] sm:w-40">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#19566A]">
                                In cart
                              </span>
                              <span className="rounded-full bg-[#FFF8D6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A16207]">
                                Bestseller
                              </span>
                            </div>

                            <h3 className="mt-3 line-clamp-2 text-[20px] font-bold leading-tight text-[#163541]">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-[#64748B]">
                              By{" "}
                              <span className="font-semibold text-[#19566A]">
                                {item.lecturer}
                              </span>
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                              <span className="text-sm font-bold text-[#D97706]">
                                {item.rating}
                              </span>
                              <span className="text-xs text-[#94A3B8]">
                                ({item.reviews.toLocaleString()} ratings)
                              </span>
                              <span className="text-xs text-[#94A3B8]">
                                Instant access after payment
                              </span>
                            </div>
                          </div>

                          <div className="flex w-full flex-row items-center justify-between border-t border-[#EDF2F7] pt-4 sm:mt-0 sm:w-auto sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                            <div className="text-left sm:text-right">
                              <div className="text-[26px] font-bold text-[#163541]">
                                {formatCurrencyVND(item.price)}
                              </div>
                              <div className="text-sm text-[#A0AEC0] line-through">
                                {formatCurrencyVND(item.originalPrice)}
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="mt-0 flex items-center gap-1.5 rounded-full bg-[#FFF1F2] px-3 py-2 text-sm font-medium text-[#E11D48] transition-colors hover:bg-[#FFE4E6] sm:mt-4"
                            >
                              <Trash2 size={16} />
                              <span className="sm:hidden">Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-[30px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#fbfcff_100%)] p-14 text-center shadow-[0_18px_46px_rgba(34,40,84,0.05)]">
                      <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[#F8FAFC] shadow-[inset_0_0_0_10px_rgba(238,244,255,0.9)]">
                        <ShoppingCart size={42} className="text-[#A0AEC0]" />
                      </div>
                      <h3 className="mb-2 text-2xl font-bold text-[#163541]">
                        Your cart is empty.
                      </h3>
                      <p className="mb-7 max-w-md text-[15px] leading-7 text-[#64748B]">
                        Keep shopping to find a course! We have thousands of
                        courses to help you learn new skills.
                      </p>
                      <Link
                        to="/courses"
                        className="flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-black shadow-[0_16px_32px_rgba(255,217,0,0.24)] transition hover:opacity-90"
                        style={{ backgroundColor: COLORS.yellowBtn }}
                      >
                        Keep Shopping
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[26px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_12px_30px_rgba(34,40,84,0.04)]">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                        Why buy now
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-[#163541]">
                        Learning starts the moment you check out
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#64748B]">
                        Instant access, flexible study time, and courses picked
                        to help you move forward faster.
                      </p>
                    </div>

                    <div className="rounded-[26px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_12px_30px_rgba(34,40,84,0.04)]">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                        Purchase note
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-[#163541]">
                        Secure checkout and 30-day confidence
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#64748B]">
                        Your order summary updates automatically, and every
                        purchase is protected with our money-back guarantee.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-full">
                  <div className="sticky top-24 overflow-hidden rounded-[30px] border border-[#E7ECF3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-6 shadow-[0_20px_60px_rgba(34,40,84,0.08)]">
                    <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,217,0,0.18),transparent_55%)]" />
                    <div className="relative">
                      <h2 className="border-b border-[#EDF2F7] pb-4 text-xl font-bold text-[#163541]">
                        Order Summary
                      </h2>

                      <div className="mb-6 mt-6 space-y-3 text-[#64748B]">
                        <div className="flex justify-between">
                          <span>Original Price:</span>
                          <span className="font-medium text-[#163541]">
                            {formatCurrencyVND(totalOriginalPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#16A34A]">
                          <span>Course Discounts:</span>
                          <span className="font-medium">
                            -{formatCurrencyVND(totalOriginalPrice - subtotal)}
                          </span>
                        </div>

                        {appliedDiscount > 0 && (
                          <div className="flex justify-between font-medium text-[#E11D48]">
                            <span>Promo Code:</span>
                            <span>-{formatCurrencyVND(appliedDiscount)}</span>
                          </div>
                        )}

                        <div className="flex justify-between border-t border-dashed border-[#D7E0EA] pt-4 text-[28px] font-bold text-[#163541]">
                          <span>Total:</span>
                          <span>{formatCurrencyVND(Math.max(0, total))}</span>
                        </div>
                      </div>

                      <div className="mb-6 rounded-3xl border border-[#E7ECF3] bg-[#F8FAFC] p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#163541]">
                          <Tag size={16} className="text-[#704FE6]" />{" "}
                          Promotions
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(e.target.value);
                              setAppliedCouponCode(null);
                              setAppliedDiscount(0);
                            }}
                            placeholder="Enter Coupon"
                            className="flex-1 rounded-xl border border-[#D8E1EA] bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-[#FFD900] focus:ring-2 focus:ring-[#FFD900]/20"
                          />
                          <button
                            onClick={handleApplyPromo}
                            disabled={
                              !promoCode.trim() ||
                              cartItems.length === 0 ||
                              isApplyingPromo
                            }
                            className="rounded-xl bg-[#163541] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#102B35] disabled:opacity-50"
                          >
                            {isApplyingPromo ? "Applying..." : "Apply"}
                          </button>
                        </div>
                      </div>

                      <button
                        disabled={cartItems.length === 0 || isCheckingOut}
                        onClick={handleCheckout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-black shadow-[0_18px_36px_rgba(255,217,0,0.24)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ backgroundColor: COLORS.yellowBtn }}
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            Checkout <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <div className="mt-5 rounded-[20px] border border-[#E7ECF3] bg-white px-4 py-4 text-center">
                        <p className="text-sm font-semibold text-[#163541]">
                          30-Day Money-Back Guarantee
                        </p>
                        <p className="mt-1 text-xs leading-6 text-[#94A3B8]">
                          Secure payment and a smoother learning journey from
                          day one.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
