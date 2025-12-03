import { useState } from "react";
import { useParams } from "react-router-dom"; // 1. Import useParams
import { MOCK_COURSES } from "../../utils/mockData"; // 2. Import Mock Data
import Details from "./components/Details";
import Method from "./components/Method";
import QRCode from "./components/QRCode";
import Success from "./components/Success";

// Import các bước con

const Payment = () => {
  const { id } = useParams(); // 3. Lấy ID từ URL (vd: /payment/1)
  const [step, setStep] = useState(1);

  // 4. Tìm khóa học tương ứng
  const course = MOCK_COURSES.find((c) => c.id.toString() === id);

  if (!course) return <div className="text-center py-20">Course not found</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFC] py-12 px-4 font-poppins">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8 text-sm text-gray-500">
        Home &gt; Course &gt; Payment &gt;{" "}
        <span className="text-[#07152F] font-bold">{course.title}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Truyền prop 'course' xuống các component con */}

        {step === 1 && <Method course={course} onNext={() => setStep(2)} />}

        {step === 2 && (
          <Details
            course={course}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && <QRCode onSuccess={() => setStep(4)} />}

        {step === 4 && <Success />}
      </div>
    </div>
  );
};

export default Payment;
