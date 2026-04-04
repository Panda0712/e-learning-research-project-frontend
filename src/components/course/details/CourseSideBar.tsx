/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, PlayCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartService } from "../../../apis/cart";
import { wishlistService } from "../../../apis/wishlist";
import Button from "../../../components/ui/Button";
import { selectCurrentUser } from "../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../redux/hooks";
import type { Course, CourseStudentState } from "../../../types/course.type";

const CourseSidebar = ({
  course,
  studentState,
  onAddedToCart,
  onAddedToWishlist,
}: {
  course: Course;
  studentState?: CourseStudentState | null;
  onAddedToCart?: () => void;
  onAddedToWishlist?: () => void;
}) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  const isPurchased = Boolean(studentState?.isPurchased);
  const isInCart = Boolean(studentState?.isInCart);
  const canAddToCart = Boolean(studentState?.canAddToCart);
  const isInWishlist = Boolean(studentState?.isInWishlist);
  const canAddToWishlist = Boolean(studentState?.canAddToWishlist);

  const handleStartLearning = () => {
    navigate(`/learning/${course.id}`);
  };

  const handleBuyNow = () => {
    navigate(`/payment/${course.id}`);
  };

  const handleAddToCart = async () => {
    if (!currentUser?.id) {
      navigate("/auth/login");
      return;
    }

    if (isPurchased) {
      toast.info("You already purchased this course.");
      return;
    }

    if (isInCart) {
      toast.info("Course already in cart.");
      return;
    }

    try {
      await cartService.addToCart({ courseId: course.id });
      toast.success("Added to cart successfully!");
      onAddedToCart?.();
    } catch (error: any) {
      const msg = String(error?.message || "");
      if (/already purchased/i.test(msg)) {
        toast.info("You already purchased this course.");
        return;
      }

      if (/already in cart/i.test(msg)) {
        toast.info("Course already in cart.");
        return;
      }

      toast.error(msg || "Failed to add course to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!currentUser?.id) return navigate("/auth/login");
    if (isPurchased) return toast.info("You already purchased this course.");
    if (isInWishlist) return toast.info("Course already in wishlist.");

    try {
      await wishlistService.addToWishlistAPI({ courseId: course.id });
      toast.success("Added to wishlist successfully!");
      onAddedToWishlist?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add course to wishlist");
    }
  };

  return (
    <div className="sticky top-24 overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] shadow-[0_24px_70px_rgba(34,40,84,0.10)]">
      <div className="relative h-64 cursor-pointer overflow-hidden group">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(7,21,47,0.10)_0%,rgba(7,21,47,0.35)_100%)] transition-colors group-hover:bg-[linear-gradient(180deg,rgba(7,21,47,0.12)_0%,rgba(7,21,47,0.42)_100%)]">
          <div className="rounded-full bg-white p-4 shadow-[0_18px_40px_rgba(34,40,84,0.18)] transition-transform hover:scale-110">
            <PlayCircle
              size={32}
              className="text-[#704FE6]"
              fill="currentColor"
            />
          </div>
        </div>
      </div>
      <div className="p-7">
        <div className="rounded-3xl border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_14px_34px_rgba(34,40,84,0.05)]">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                Course price
              </p>
              <span className="mt-2 block text-[34px] font-bold leading-none text-[#163541]">
                ${course.price}
              </span>
            </div>
            <span className="text-sm text-[#A0AEC0] line-through">
              ${course.price + 20}
            </span>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                Lessons
              </p>
              <p className="mt-1 text-lg font-semibold text-[#163541]">
                {course.lessons}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                Students
              </p>
              <p className="mt-1 text-lg font-semibold text-[#163541]">
                {course.students}
              </p>
            </div>
          </div>

          {isPurchased ? (
            <Button
              content="Start Now"
              type="primary"
              onClick={handleStartLearning}
              additionalClass="!mb-4 !w-full !rounded-full !bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] !text-lg !font-bold !text-white shadow-[0_18px_34px_rgba(112,79,230,0.24)]"
            />
          ) : (
            <Button
              content="Buy Now"
              type="primary"
              onClick={handleBuyNow}
              additionalClass="!mb-4 !w-full !rounded-full !bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] !text-lg !font-bold !text-white shadow-[0_18px_34px_rgba(112,79,230,0.24)]"
            />
          )}

          {!isPurchased && (
            <Button
              icon={<ShoppingCart size={18} />}
              content={isInCart ? "Already in cart" : "Add to cart"}
              type="secondary"
              onClick={handleAddToCart}
              disabled={isInCart || !canAddToCart}
              additionalClass="!w-full !rounded-full !border-[#D8E1EA] !bg-white !text-sm !font-bold !text-[#19566A] shadow-[0_10px_24px_rgba(34,40,84,0.05)]"
            />
          )}

          {!isPurchased && (
            <Button
              icon={
                <Heart
                  size={18}
                  className={isInWishlist ? "fill-current" : ""}
                />
              }
              content={isInWishlist ? "Already in wishlist" : "Add to wishlist"}
              type="secondary"
              onClick={handleAddToWishlist}
              disabled={isInWishlist || !canAddToWishlist}
              additionalClass="!mt-3 !w-full !rounded-full !border-[#D8E1EA] !bg-white !text-sm !font-bold !text-[#19566A] shadow-[0_10px_24px_rgba(34,40,84,0.05)]"
            />
          )}
        </div>

        <div className="mt-5 rounded-3xl border border-[#E7ECF3] bg-white px-5 py-4">
          <p className="text-sm font-semibold text-[#163541]">
            Included with this course
          </p>
          <div className="mt-3 space-y-2 text-sm text-[#64748B]">
            <p>Full lifetime access</p>
            <p>Structured lessons and guided learning</p>
            <p>Study anytime at your own pace</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
