const Description = ({ description }: { description?: string }) => {
  return (
    <div className="text-[#555555] text-sm leading-7 font-poppins">
      <h3 className="font-bold text-lg text-[#07152F] mb-4">
        Lectures Description
      </h3>
      <div className="space-y-4">{description}</div>
    </div>
  );
};

export default Description;
