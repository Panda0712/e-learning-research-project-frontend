interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const ToggleSwitch = ({
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange()}
      className={`
        relative inline-flex h-[19.69px] w-8.75 items-center rounded-full
        transition-colors duration-300
        ${checked ? "bg-[#7C3AED]" : "bg-[#9CA3AF]"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          inline-block h-3.5 w-3.5 transform rounded-full bg-white
          transition-transform duration-300
          ${checked ? "translate-x-[18.8px]" : "translate-x-0.5"}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
