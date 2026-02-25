const HeadingText = ({ content = "", additionalClass = "" }) => {
  return (
    <h3 className={`font-bold text-[60px] ${additionalClass}`}>{content}</h3>
  );
};

export default HeadingText;
