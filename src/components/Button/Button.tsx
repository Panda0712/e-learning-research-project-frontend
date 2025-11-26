const Button = ({
  content = "",
  onClick = () => {},
  type = "primary",
  additionalClass = "",
}) => {
  let buttonBg = "bg-[#f5c362]";

  switch (type) {
    case "primary":
      break;
    case "secondary":
      buttonBg =
        "bg-white border-[2px] border-[#309dc1] rounded-tl-[15px] rounded-b-[15px] rounded-tr-none";
      break;
    default:
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`w-32 h-[62px] rounded-[20px] p-2.5 
      text-[22px] text-[#190d30] font-poppins font-semibold 
      cursor-pointer hover:opacity-85 duration-300 ease ${buttonBg} ${additionalClass}`}
    >
      {content}
    </button>
  );
};

export default Button;
