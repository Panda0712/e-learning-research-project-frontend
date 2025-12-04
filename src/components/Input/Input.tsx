import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "outline" | "underline";
  containerClass?: string;
}

const Input = ({
  leftIcon,
  rightIcon,
  variant = "underline",
  containerClass = "",
  className = "",
  ...props
}: InputProps) => {
  const baseStyle =
    "w-full py-2 bg-transparent focus:outline-none transition-colors placeholder-gray-400 font-poppins text-black";

  const variantStyle =
    variant === "outline"
      ? "border border-gray-300 rounded-lg px-3 focus:border-black"
      : "border-b border-gray-300 focus:border-black px-0"; // underline

  return (
    <div className={`relative flex items-center ${containerClass}`}>
      {leftIcon && (
        <div className="absolute left-0 pl-0 pointer-events-none text-gray-400">
          {leftIcon}
        </div>
      )}

      <input
        className={`
          ${baseStyle} 
          ${variantStyle}
          ${leftIcon ? "pl-8" : ""} 
          ${rightIcon ? "pr-10" : ""}
          ${className}
        `}
        {...props}
      />

      {rightIcon && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer transition-colors">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default Input;
