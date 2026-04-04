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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24 border border-gray-100">
      <div className="h-56 relative group cursor-pointer">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <div className="bg-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
            <PlayCircle
              size={32}
              className="text-orange-500"
              fill="currentColor"
            />
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-bold text-orange-500">
            ${course.price}
          </span>
          <span className="text-gray-400 line-through text-sm">
            ${course.price + 20}
          </span>
        </div>
        {isPurchased ? (
          <Button
            content="Start Now"
            type="primary"
            onClick={handleStartLearning}
            additionalClass="!w-full !rounded-full !text-white !text-lg !font-bold mb-4 !bg-orange-500"
          />
        ) : (
          <Button
            content="Buy Now"
            type="primary"
            onClick={handleBuyNow}
            additionalClass="!w-full !rounded-full !text-white !text-lg !font-bold mb-4 !bg-orange-500"
          />
        )}

        {!isPurchased && (
          <Button
            icon={<ShoppingCart size={18} />}
            content={isInCart ? "Already in cart" : "Add to cart"}
            type="secondary"
            onClick={handleAddToCart}
            disabled={isInCart || !canAddToCart}
            additionalClass="!w-full !rounded-full !text-sm !font-bold"
          />
        )}

        {!isPurchased && (
          <Button
            icon={
              <Heart size={18} className={isInWishlist ? "fill-current" : ""} />
            }
            content={isInWishlist ? "Already in wishlist" : "Add to wishlist"}
            type="secondary"
            onClick={handleAddToWishlist}
            disabled={isInWishlist || !canAddToWishlist}
            additionalClass="!mt-3 !w-full !rounded-full !text-sm !font-bold"
          />
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;
