import Button from "../../../components/Button/Button";
import CategoryFilter from "./components/CategoryFilter";
import InstructorFilter from "./components/InstructorFilter";
import LevelFilter from "./components/LevelFilter";
import PriceFilter from "./components/PriceFilter";
import ReviewFilter from "./components/ReviewFilter";

const Sidebar = () => {
  return (
    <aside className="w-full bg-white p-6 rounded-[25px] border border-gray-100 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
      <CategoryFilter />
      <InstructorFilter />
      <PriceFilter />
      <ReviewFilter />
      <LevelFilter />

      <div className="flex gap-3 mt-6">
        <Button
          content="Uncheck"
          type="secondary"
          onClick={() => console.log("Uncheck")}
          additionalClass="!w-full !h-[40px] !text-[14px] !rounded-full !bg-white !border-gray-300 !text-gray-600 hover:!bg-gray-50"
        />

        <Button
          content="Apply"
          type="primary"
          onClick={() => console.log("Apply")}
          additionalClass="!w-full !h-[40px] !text-[14px] !rounded-full text-[#190d30]"
        />
      </div>
    </aside>
  );
};

export default Sidebar;
