import Star from "../../../../components/Star/Star";
import { color } from "../../../../utils/constants";

const ReviewFilter = () => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
        Review
      </h3>
      {[5, 4, 3, 2].map((starCount) => (
        <div
          key={starCount}
          className="flex items-center justify-between mb-2 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked={starCount >= 4}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <div className="pointer-events-none">
              <Star
                count={5}
                value={starCount}
                edit={false}
                size={18}
                color1="#cbd5e1"
                color2={color.yellow}
              />
            </div>
          </div>
          <span className="text-xs text-[#9D9D9D] font-poppins">(1,025)</span>
        </div>
      ))}
    </div>
  );
};

export default ReviewFilter;
