import React from "react";

interface ToggleSwitchProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isActive,
  onClick,
  disabled,
  label,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={label ?? "Aktiv"}
      disabled={disabled}
      onClick={onClick}
      className={`cursor-pointer disabled:cursor-wait w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
        isActive ? "bg-green-400" : ""
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
          isActive ? "translate-x-6" : ""
        }`}
      ></div>
    </button>
  );
};

export default ToggleSwitch;
