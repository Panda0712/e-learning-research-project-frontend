const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const colors = [
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-green-400",
  "bg-green-600",
];

const PasswordStrength = ({ score }: { score: number }) => {
  const idx = Math.max(0, Math.min(4, score));
  const width = `${((idx + 1) / 5) * 100}%`;

  return (
    <div className="mt-2 mb-8">
      <div className="flex items-center justify-between mt-8 mb-1">
        <h5 className="text-[14px] text-[#4B5563] font-normal">
          Password Strength
        </h5>
        <p className="text-[14px] text-right font-medium text-[#16A34A]">
          {labels[idx]}
        </p>
      </div>

      <div className="w-full h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
        <div
          className={`h-3 rounded-full ${colors[idx]}`}
          style={{ width }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrength;
