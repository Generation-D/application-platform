import React from "react";

export interface ChoiceProps {
  choiceid: string;
  choicetext: string;
  isSelected: boolean;
  iseditable: boolean;
  minanswers: number;
  maxanswers: number;
  onSingleChange: () => void;
  onMultiChange: () => void;
}

export const Choice: React.FC<ChoiceProps> = ({
  choiceid,
  choicetext,
  isSelected,
  iseditable,
  minanswers,
  maxanswers,
  onSingleChange,
  onMultiChange,
}) => {
  return (
    <div key={choiceid} className="flex items-center mb-4">
      {maxanswers == 1 ? (
        <input
          id={choiceid}
          name={choiceid}
          disabled={!iseditable}
          aria-disabled={!iseditable}
          type="radio"
          className={`w-5 h-4 text-secondary bg-gray-100 border-gray-300 focus:secondary focus:ring-2 ${iseditable ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          checked={isSelected}
          onChange={onSingleChange}
          onClick={onSingleChange}
        />
      ) : (
        <input
          id={choiceid}
          name={choiceid}
          disabled={!iseditable}
          aria-disabled={!iseditable}
          type="checkbox"
          checked={isSelected}
          onChange={onMultiChange}
          className={`w-5 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-secondary focus:ring-2 ${iseditable ? "cursor-pointer" : "cursor-not-allowed"
            }`}
        />
      )}
      <label
        htmlFor={choiceid}
        className={`ml-3 block text-sm font-medium text-secondary ${iseditable ? "cursor-pointer" : "cursor-not-allowed"
          }`}
      >
        {choicetext}
      </label>
    </div>
  );
};
