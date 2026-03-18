import { Heart, ShoppingCart, Loader2, Star } from "lucide-react"; // Đã xóa Trash2 dư thừa
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Redux
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";

// APIs
import { wishlistService } from "../../apis/wishlist";
import { cartService } from "../../apis/cart"; 

const COLORS = {
  yellowBtn: "#FFD900",
};

interface WishlistItemType {
  id: number;
  courseId: number;
  title: string;
  lecturer: string;
  thumbnail: string;
  price: number;
  rating: number;
  reviews: number;
}

const Wishlist = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  const [wishlistItems, setWishlistItems] = useState<WishlistItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // GỌI API LẤY DANH SÁCH WISHLIST
  // ==========================================
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser || !currentUser.id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Lưu ý: Đảm bảo wishlistService cũng export đúng tên hàm getWishlistsByUserIdAPI
        const response = await wishlistService.getWishlistsByUserIdAPI(currentUser.id);
        
        if (response && response.data) {
          const mappedItems = response.data.map((item: any) => ({
            id: item.id,
            courseId: item.courseId,
            title: item.courseName || "Khóa học",
            lecturer: item.lecturer || "Giảng viên",
            thumbnail: item.courseThumbnail || "https://placehold.co/600x400/3b82f6/white?text=EduLearn",
            price: 19.99, 
            rating: 4.8,
            reviews: 1250,
          }));
          setWishlistItems(mappedItems);
        }
      } catch (error: any) {
        console.error("Lỗi lấy wishlist", error);
        toast.error("Không thể tải danh sách yêu thích!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  // ==========================================
  // XÓA KHỎI WISHLIST
  // ==========================================
  const handleRemove = async (id: number) => {
    try {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      await wishlistService.removeWishlistItemAPI(id);
      toast.success("Đã xóa khỏi danh sách yêu thích!");
    } catch (error) {
      toast.error("Xóa thất bại. Vui lòng thử lại!");
    }
  };

  // ==========================================
  // THÊM VÀO GIỎ HÀNG TỪ WISHLIST
  // ==========================================
  const handleAddToCart = async (item: WishlistItemType) => {
    if (!currentUser) {
      toast.info("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }
    
    try {
      // ĐÃ SỬA: Đổi addToCartAPI -> addToCart để khớp với Backend Service
      await cartService.addToCart({
        userId: currentUser.id,
        courseId: item.courseId,
        price: item.price,
      });
      toast.success("Đã thêm khóa học vào giỏ hàng!", { theme: "colored" });
      
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng";
      toast.warning(msg);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-[Inter]">
            My Wishlist
          </h1>
          {!isLoading && wishlistItems.length > 0 && (
            <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm font-bold">
              {wishlistItems.length} items
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="font-medium text-gray-500">Đang tải danh sách yêu thích...</p>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
              >
                <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Heart size={18} className="fill-red-500" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <Link to={`/courses/${item.courseId}`}>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight hover:text-blue-600 transition-colors mb-1">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.lecturer}
                  </p>

                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-sm font-bold text-yellow-600">
                      {item.rating}
                    </span>
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-400 ml-1">
                      ({item.reviews.toLocaleString()})
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xl font-bold text-gray-900">
                      ${item.price}
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-black shadow-sm transition hover:opacity-90 text-sm"
                      style={{ backgroundColor: COLORS.yellowBtn }}
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center min-h-[50vh]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Heart size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Your wishlist is currently empty.
            </h3>
            <p className="text-gray-500 mb-8 max-w-md">
              Found a course you like? Click the heart icon to save it for later.
            </p>
            <Link
              to="/courses"
              className="px-8 py-3 rounded-lg font-bold text-black shadow-sm hover:opacity-90 transition flex items-center gap-2"
              style={{ backgroundColor: COLORS.yellowBtn }}
            >
              Explore Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;