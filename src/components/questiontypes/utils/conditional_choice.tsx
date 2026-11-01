import React from "react";

export interface ChoiceProps {
  choiceid: string;
  choicevalue: string;
  isSelected: boolean;
  iseditable: boolean;
  onChange: () => void;
}

export const ConditionalChoice: React.FC<ChoiceProps> = ({
  choiceid,
  choicevalue,
  isSelected,
  iseditable,
  onChange,
}) => {
  return (
    <div key={choiceid} className="flex items-center mb-4">
      <input
        id={choiceid}
        name={choiceid}
        disabled={!iseditable}
        aria-disabled={!iseditable}
        type="radio"
        className={`w-5 h-4 text-secondary bg-gray-100 border-gray-300 focus:secondary focus:ring-2 ${
          iseditable ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        checked={isSelected}
        onChange={onChange}
        onClick={onChange}
      />
      <label
        htmlFor={choiceid}
        className={`ml-3 block text-sm font-medium text-secondary ${
          iseditable ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        {choicevalue}
      </label>
    </div>
  );
};
