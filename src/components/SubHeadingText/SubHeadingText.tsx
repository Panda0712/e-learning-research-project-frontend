const SubHeadingText = ({ content = "", additionalClass = "" }) => {
  return (
    <p
      className={`text-[#565a5b] text-[22px] font-medium font-poppins ${additionalClass}`}
    >
      {content}
    </p>
  );
};

export default SubHeadingText;
