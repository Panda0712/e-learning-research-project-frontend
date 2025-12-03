import FilterItem from "./FilterItem";

const PriceFilter = () => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
        Price
      </h3>
      <FilterItem label="All" count={15} defaultChecked />
      <FilterItem label="Free" count={15} />
      <FilterItem label="Paid" count={15} />
    </div>
  );
};

export default PriceFilter;
