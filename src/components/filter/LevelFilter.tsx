import FilterItem from "./FilterItem";

const LevelFilter = () => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
        Level
      </h3>
      <FilterItem label="All Levels" count={15} />
      <FilterItem label="Beginner" count={15} />
      <FilterItem label="Intermediate" count={15} defaultChecked />
      <FilterItem label="Expert" count={15} />
    </div>
  );
};

export default LevelFilter;
