import { Search } from "lucide-react";
import Input from "../ui/Input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
};

const CourseHeader = ({ value, onChange, onSubmit }: Props) => {
  return (
    <div className="sticky top-0 z-20 border-b border-white/70 bg-white/72 backdrop-blur-xl">
      <header className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-3 text-sm font-medium text-[#94A3B8] font-poppins">
          Home &gt; Course
        </div>

        <div className="flex flex-col gap-5 rounded-[28px] border border-white/70 bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5 shadow-[0_16px_45px_rgba(34,40,84,0.06)] md:flex-row md:items-end md:justify-between md:px-7">
          <div>
            <h1 className="text-3xl font-semibold text-[#163541] font-poppins md:text-[40px]">
              All Courses
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-[#64748B]">
              Explore thoughtfully designed courses for every skill level.
            </p>
          </div>

          <form
            className="w-full md:w-90"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.();
            }}
          >
            <Input
              placeholder="Search"
              variant="outline"
              rightIcon={<Search size={20} className="mr-3" />}
              containerClass="group rounded-full border border-[#E7ECF3] bg-white px-4 shadow-[0_10px_30px_rgba(34,40,84,0.06)] transition-all duration-300 hover:border-[#704FE6]/20 focus-within:border-[#704FE6]/25 focus-within:shadow-[0_16px_34px_rgba(112,79,230,0.10)]"
              className="border-none! bg-transparent! px-0! py-3! text-[15px] text-[#163541] placeholder:text-[#94A3B8]"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </form>
        </div>
      </header>
    </div>
  );
};

export default CourseHeader;
