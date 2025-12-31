interface ButtonProps {
  content?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?:
    | "primary"
    | "secondary"
    | "submit"
    | "cancel"
    | "cancel-v2"
    | "submit-v2"
    | "delete"
    | "publish";
  additionalClass?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  content,
  icon,
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
    case "submit-v2":
      buttonBg =
        "h-[48px]! w-auto rounded-lg bg-[#16A34A] p-6 text-white text-[18px]! font-medium cursor-pointer duration-300 ease hover:opacity-90";
      break;
    case "cancel":
      buttonBg =
        "bg-white h-10! rounded-full text-[#4458FE] text-[16px]! w-auto font-medium shadow-sm cursor-pointer duration-300 ease hover:opacity-90";
      break;
    case "cancel-v2":
      buttonBg =
        "bg-white h-[48px]! rounded-lg border border-[#E2E8F0] px-6 text-[18px]! w-auto font-medium cursor-pointer duration-300 ease hover:opacity-90";
      break;
    case "delete":
      buttonBg =
        "bg-[#DC2626] h-[48px]! rounded-lg px-6 text-[18px]! text-white w-auto font-medium cursor-pointer duration-300 ease hover:opacity-90";
      break;
    case "publish":
      buttonBg =
        "bg-[#3B82F6] h-[48px]! rounded-lg px-6 text-[18px]! text-white w-auto font-medium cursor-pointer duration-300 ease hover:opacity-90";
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
        flex items-center justify-center gap-2
        ${buttonBg} 
        ${additionalClass}
      `}
      {...props}
    >
      {icon && icon}
      <span>{content}</span>
    </button>
  );
};

export default Button;
