export const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <div
      className={`
          flex flex-col gap-1 w-full bg-white border 
          rounded-lg px-4 py-2 cursor-pointer
          ${error ? "border-red-500" : "border-[#E2E8F0]"}
        `}
    >
      <p className="text-[14px] font-normal text-[#9D9D9D] font-poppins">
        {label}
      </p>
      {children}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
