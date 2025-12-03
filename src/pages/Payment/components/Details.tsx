import Button from "../../../components/Button/Button";
import type { Course } from "../../../types/course.type";

interface Props {
  course: Course;
  onNext: () => void;
  onBack: () => void;
}

const Step2_Details = ({ course, onNext, onBack }: Props) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={course.image}
            alt={course.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <h2 className="text-xl font-bold text-[#07152F]">{course.title}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4 leading-6 line-clamp-3">
          {course.description}
        </p>
        <h4 className="font-bold mb-2 text-[#07152F]">Skills You Will Gain:</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          {course.whatYouWillLearn?.slice(0, 2).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-80 border-l pl-0 md:pl-8 border-gray-100">
        <h3 className="font-bold text-lg mb-6 border-b pb-2">
          Payment Details
        </h3>

        <div className="space-y-4 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Original Price</span>
            <span className="font-bold line-through">${course.price + 20}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Discounted Price</span>
            <span className="font-bold text-orange-500">${course.price}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter discount code"
            className="border p-2 rounded text-sm w-full outline-none focus:border-black"
          />
          <Button
            content="Apply"
            onClick={() => {}}
            additionalClass="!w-auto !h-auto !bg-gray-200 !text-xs !font-bold !px-3 !py-1.5 !rounded hover:!bg-gray-300 !text-black !border-0"
          />
        </div>

        <div className="flex justify-between font-bold text-lg mb-6 border-t pt-4">
          <span>Total</span>
          <span>${course.price}</span>
        </div>

        <Button
          content="Continue Payment"
          onClick={onNext}
          additionalClass="!w-full !rounded-lg !bg-orange-300 !text-[#07152F] !font-bold !py-2 hover:!bg-orange-400 transition-colors mb-3"
        />
        <Button
          content="Cancel & Go Back"
          onClick={onBack}
          additionalClass={`
    !w-full !h-auto           
    !bg-transparent           
    !text-xs !text-gray-500   
    hover:!underline         
    !p-0                      
    !rounded-none          
    !border-0                 
    !font-normal              
  `}
        />
      </div>
    </div>
  );
};

export default Step2_Details;
