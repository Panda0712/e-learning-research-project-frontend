import LeftIcon from "../../assets/left-chevron.svg?react";
import RightIcon from "../../assets/chevron-right.svg?react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  type?: "primary" | "secondary" | "dashboard";
}

const PrimaryRender = ({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-center mt-8">
      <button
        disabled={currentPage == 1}
        onClick={() => onChange(currentPage - 1)}
        className="w-10.75 h-10.75 flex items-center justify-center
         rounded border border-[#E2E8F0] disabled:opacity-40"
      >
        <LeftIcon />
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`w-10.75 h-10.75 flex items-center justify-center 
                rounded border border-[#E2E8F0] ${
                  page == currentPage
                    ? "bg-orange-500 text-white border-orange-500"
                    : "hover:bg-gray-100"
                }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage == totalPages}
        onClick={() => onChange(currentPage + 1)}
        className="w-10.75 h-10.75 flex items-center justify-center
         rounded border border-[#E2E8F0] disabled:opacity-40"
      >
        <RightIcon />
      </button>
    </div>
  );
};

const SecondaryRender = ({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#190D30] border border-[#eaeaea]
            hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`w-10 h-10 rounded-full flex items-center border border-[#eaeaea]
                justify-center text-[16px] font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#190D30] text-white"
                    : "text-[#190D30] hover:bg-gray-100"
                }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#190D30] hover:bg-gray-100 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[#eaeaea]"
      >
        ›
      </button>
    </div>
  );
};

const DashboardRender = ({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-center mt-8">
      <button
        disabled={currentPage == 1}
        onClick={() => onChange(currentPage - 1)}
        className="bg-white w-10.75 h-10.75 flex items-center justify-center
         rounded-tl rounded-bl border border-[#E2E8F0] disabled:opacity-40 cursor-pointer"
      >
        <LeftIcon className="font-semibold" />
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`bg-white cursor-pointer w-10.75 h-10.75 flex items-center justify-center 
                border border-[#E2E8F0] font-semibold text-[#334155] ${
                  page == currentPage
                    ? "bg-gray-100 border-black"
                    : "hover:bg-gray-100"
                }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage == totalPages}
        onClick={() => onChange(currentPage + 1)}
        className="bg-white w-10.75 h-10.75 flex items-center justify-center
         rounded-tr rounded-br border border-[#E2E8F0] disabled:opacity-40 cursor-pointer"
      >
        <RightIcon className="font-semibold" />
      </button>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onChange,
  type,
}: PaginationProps) => {
  return type == "primary" ? (
    <PrimaryRender
      currentPage={currentPage}
      totalPages={totalPages}
      onChange={onChange}
    />
  ) : type === "secondary" ? (
    <SecondaryRender
      currentPage={currentPage}
      totalPages={totalPages}
      onChange={onChange}
    />
  ) : (
    <DashboardRender
      currentPage={currentPage}
      totalPages={totalPages}
      onChange={onChange}
    />
  );
};

export default Pagination;
