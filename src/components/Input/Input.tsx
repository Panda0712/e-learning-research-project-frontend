import React from "react";

type BaseProps = {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "outline" | "underline" | "no-line";
  containerClass?: string;
};

type InputAsInput = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    inputType?: "input";
  };

type InputAsTextarea = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    inputType: "textarea";
  };

type InputProps = InputAsInput | InputAsTextarea;

const Input = ({
  leftIcon,
  rightIcon,
  variant = "underline",
  containerClass = "",
  className = "",
  inputType,
  ...props
}: InputProps) => {
  const baseStyle =
    "w-full py-2 bg-transparent focus:outline-none transition-colors placeholder-gray-400 font-poppins text-black";

  const variantStyle =
    variant === "outline"
      ? "border border-gray-300 rounded-lg px-3 focus:border-black"
      : variant === "underline"
      ? "border-b border-gray-300 focus:border-black px-0"
      : "outline-none px-0 py-0!";

  const commonClass = `
    ${baseStyle}
    ${variantStyle}
    ${leftIcon ? "pl-8" : ""}
    ${rightIcon ? "pr-10" : ""}
    ${className}
  `;

  return (
    <div className={`relative flex items-center ${containerClass}`}>
      {leftIcon && (
        <div className="absolute left-0 pl-0 pointer-events-none text-gray-400">
          {leftIcon}
        </div>
      )}

      {inputType === "textarea" ? (
        <textarea
          className={`${commonClass} resize-none min-h-13`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={commonClass}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {rightIcon && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer transition-colors">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default Input;
