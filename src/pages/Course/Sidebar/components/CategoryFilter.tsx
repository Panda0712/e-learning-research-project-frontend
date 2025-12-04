import FilterItem from "./FilterItem";

const CategoryFilter = () => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
        Course Category
      </h3>
      <FilterItem label="Web Development" count={15} />
      <FilterItem label="Mobile Development" count={15} />
      <FilterItem label="3D & Animation" count={15} defaultChecked />
      <FilterItem label="Soft Skills" count={15} />
      <FilterItem label="Entrepreneurship" count={15} defaultChecked />
      <FilterItem label="Cybersecurity" count={15} />
      <FilterItem label="Game Development" count={15} />
      <FilterItem label="Data Science" count={15} />
    </div>
  );
};

export default CategoryFilter;
