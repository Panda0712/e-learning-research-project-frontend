import Button from "../../../components/Button/Button";
import type { Course } from "../../../types/course.type";

interface Props {
  course: Course;
  onNext: () => void;
}

const Method = ({ course, onNext }: Props) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-6 text-[#07152F]">Payment Method</h2>

      <div className="bg-orange-50 p-4 rounded-lg flex items-center gap-4 mb-8 text-left">
        <img
          src={course.image}
          alt={course.title}
          className="w-12 h-12 rounded object-cover"
        />
        <div>
          <h4 className="font-bold text-[#07152F] text-sm line-clamp-1">
            {course.title}
          </h4>
          <p className="text-xs text-gray-500">{course.category}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4 text-left">
        Select the Payment Methods you Want to Use
      </p>

      <div className="space-y-3 mb-8">
        {["MoMo", "Bank Transfer", "Paypal", "Credit Card"].map(
          (method, idx) => (
            <label
              key={idx}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors bg-white"
            >
              <span className="text-sm font-bold text-[#07152F]">{method}</span>
              <input
                type="radio"
                name="payment_method"
                className="accent-orange-500 w-5 h-5"
                defaultChecked={idx === 0}
              />
            </label>
          )
        )}
      </div>

      <Button
        content={`Enroll Course - $${course.price}`}
        onClick={onNext}
        additionalClass="!w-full !rounded-full !bg-[#2580D5] !text-white !font-bold !py-3 hover:!bg-blue-600 transition-colors shadow-lg shadow-blue-200"
      />
    </div>
  );
};

export default Method;
