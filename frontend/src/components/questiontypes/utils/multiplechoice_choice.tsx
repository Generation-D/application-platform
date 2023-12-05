import React, { useState } from "react";

export interface ChoiceProps {
  choiceid: string;
  choicetext: string;
  isSelected: boolean;
  mandatory: boolean;
  minanswers: number;
  maxanswers: number;
  onSingleChange: () => void;
  onMultiChange: () => void;
}

export const Choice: React.FC<ChoiceProps> = ({
  choiceid,
  choicetext,
  isSelected,
  mandatory,
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
          type="radio"
          className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:secondary focus:ring-2"
          checked={isSelected}
          onChange={onSingleChange}
          onClick={onSingleChange}
        />
      ) : (
        <input
          id={choiceid}
          name={choiceid}
          type="checkbox"
          checked={isSelected}
          onChange={onMultiChange}
          className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-secondary focus:ring-2"
        />
      )}
      <label
        htmlFor={choiceid}
        className="ml-3 block text-sm font-medium text-secondary"
      >
        {choicetext}
      </label>
    </div>
  );
};
