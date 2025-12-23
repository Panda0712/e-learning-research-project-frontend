interface ButtonProps {
  content?: React.ReactNode;
  onClick?: () => void;
  type?: "primary" | "secondary" | "submit" | "cancel";
  additionalClass?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  content,
  onClick = () => {},
  type = "primary",
  additionalClass = "",
  disabled = false,
  ...props
}) => {
  let buttonBg = "bg-[#f5c362]";

  switch (type) {
    case "primary":
      break;
    case "secondary":
      buttonBg =
        "bg-white border-[2px] border-[#309dc1] rounded-tl-[15px] rounded-b-[15px] rounded-tr-none";
      break;
    case "submit":
      buttonBg =
        "h-10! w-auto rounded-full bg-linear-to-r from-blue-500 to-indigo-500 text-white text-[16px]! font-medium shadow-sm cursor-pointer duration-300 ease hover:opacity-90";
      break;
    case "cancel":
      buttonBg =
        "bg-white h-10! rounded-full text-[#4458FE] text-[16px]! w-auto font-medium shadow-sm cursor-pointer duration-300 ease hover:opacity-90";
      break;
    default:
      break;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-32 h-15.5 rounded-[20px] p-2.5 
        text-[22px] text-[#190d30] font-poppins font-semibold 
        cursor-pointer hover:opacity-85 duration-300 ease 
        flex items-center justify-center
        ${buttonBg} 
        ${additionalClass}
      `}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
