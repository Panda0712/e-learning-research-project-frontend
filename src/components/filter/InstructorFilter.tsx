import FilterItem from "./FilterItem";

const InstructorFilter = () => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
        Instructors
      </h3>
      <FilterItem label="Tuan Andy" count={15} />
      <FilterItem label="Hieu David" count={15} />
    </div>
  );
};

export default InstructorFilter;
