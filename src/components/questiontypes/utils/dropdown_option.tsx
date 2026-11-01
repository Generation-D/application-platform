import React from "react";

export interface DropdownOptionProps {
  optionid: string;
  optiontext: string;
  iseditable: boolean;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({
  optionid,
  optiontext,
  iseditable,
}) => {
  return (
    <option
      key={optionid}
      value={optionid}
      disabled={!iseditable}
      aria-disabled={!iseditable}
    >
      {optiontext}
    </option>
  );
};
