/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, Loader2, ShoppingCart, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { cartService } from "../../apis/cart";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";

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
  const currentUser = useAppSelector(selectCurrentUser);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

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

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "LEARN2026") {
      setAppliedDiscount(5.0);
      toast.success("Applied coupon successfully!");
    } else {
      toast.error("Coupon code is not valid!");
      setAppliedDiscount(0);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-[Inter]">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {cartItems.length} Course{cartItems.length !== 1 && "s"} in Cart
            </h2>

            {isLoading ? (
              <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 
              p-12 flex flex-col items-center justify-center"
              >
                <Loader2
                  className="animate-spin text-blue-500 mb-2"
                  size={32}
                />
                <p className="text-gray-500">Loading cart...</p>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center bg-white 
                    rounded-xl shadow-sm border border-gray-100 p-4 gap-4 transition hover:shadow-md"
                  >
                    <div className="w-full sm:w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        By {item.lecturer}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-yellow-600">
                          {item.rating}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({item.reviews.toLocaleString()} ratings)
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex flex-row sm:flex-col items-center sm:items-end justify-between 
                    w-full sm:w-auto mt-4 sm:mt-0 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0"
                    >
                      <div className="text-left sm:text-right">
                        <div className="text-xl font-bold text-black">
                          ${item.price}
                        </div>
                        <div className="text-sm text-gray-400 line-through">
                          ${item.originalPrice}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-0 sm:mt-4 text-gray-400 hover:text-red-500 flex 
                        items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <Trash2 size={16} />
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 
              flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart size={40} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Your cart is empty.
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Keep shopping to find a course! We have thousands of courses
                  to help you learn new skills.
                </p>
                <Link
                  to="/courses"
                  className="px-6 py-3 rounded-lg font-bold text-black shadow-sm 
                  hover:opacity-90 transition flex items-center gap-2"
                  style={{ backgroundColor: COLORS.yellowBtn }}
                >
                  Keep Shopping
                </Link>
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Original Price:</span>
                  <span>${totalOriginalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Course Discounts:</span>
                  <span>-${(totalOriginalPrice - subtotal).toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-red-500 font-medium">
                    <span>Promo Code:</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div
                  className="flex justify-between pt-4 border-t border-dashed 
                border-gray-200 text-2xl font-bold text-black"
                >
                  <span>Total:</span>
                  <span>${Math.max(0, total).toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <Tag size={16} /> Promotions
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter Coupon"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none 
                    focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-sm uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || cartItems.length === 0}
                    className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg 
                    text-sm hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0}
                className="w-full py-3.5 rounded-lg font-bold text-black shadow-sm hover:opacity-90 
                transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.yellowBtn }}
              >
                Checkout <ArrowRight size={18} />
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
